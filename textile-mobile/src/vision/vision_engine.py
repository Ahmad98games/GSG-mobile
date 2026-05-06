import cv2
import numpy as np
import requests
import json
import time
import threading
import os
import signal
import sys
from typing import List, Dict, Any, Optional
from http.server import BaseHTTPRequestHandler, HTTPServer

# CONFIGURATION
SUPABASE_URL = os.environ.get('SUPABASE_URL', '')
SUPABASE_SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_KEY', '')
REPORT_INTERVAL = 5 # seconds

class CameraWorker(threading.Thread):
    def __init__(self, cam_config: Dict[str, Any]):
        super().__init__()
        self.config = cam_config
        self.id = cam_config['id']
        self.rtsp_url = cam_config['rtsp_url']
        self.node_id = cam_config['node_id']
        self.tenant_id = cam_config['tenant_id']
        self.label = cam_config['label']
        
        self.running = True
        self.status = 'unknown'
        self.last_frame_at = 0
        self.consecutive_low_bitrate = 0
        self.bytes_received = 0
        self.start_time = time.time()

    def report_telemetry(self, telemetry: Dict[str, Any]):
        url = f"{SUPABASE_URL}/rest/v1/cctv_telemetry"
        headers = {
            "apikey": SUPABASE_SERVICE_KEY,
            "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        }
        
        for attempt in range(3):
            try:
                response = requests.post(url, headers=headers, json=telemetry, timeout=5)
                if response.status_code < 300:
                    break
            except Exception as e:
                print(f"[Worker {self.id}] Report failed (attempt {attempt+1}): {e}")
            time.sleep(2)

    def run(self):
        print(f"[Worker {self.id}] Starting for {self.label}...")
        
        while self.running:
            cap = cv2.VideoCapture(self.rtsp_url)
            reconnect_attempts = 0
            
            while self.running:
                start_read = time.time()
                ret, frame = cap.read()
                latency_ms = (time.time() - start_read) * 1000
                
                if not ret:
                    self.status = 'offline'
                    reconnect_attempts += 1
                    print(f"[Worker {self.id}] Reconnect attempt {reconnect_attempts}")
                    if reconnect_attempts >= 3:
                        self.report_telemetry({
                            "node_id": self.node_id,
                            "tenant_id": self.tenant_id,
                            "fault_type": "node_offline"
                        })
                    time.sleep(5)
                    break
                
                self.status = 'online'
                self.last_frame_at = time.time()
                self.bytes_received += frame.nbytes
                
                # Analysis every 500ms
                if int(time.time() * 1000) % 500 < 50:
                    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                    avg_brightness = float(np.mean(gray))
                    frame_variance = float(np.var(gray))
                    
                    elapsed = time.time() - self.start_time
                    bitrate_kbps = (self.bytes_received * 8 / 1024) / elapsed if elapsed > 0 else 0
                    
                    fault_type = None
                    if avg_brightness < 15 and frame_variance < 100:
                        fault_type = "lens_obscured"
                    elif avg_brightness > 230:
                        fault_type = "lens_dirty"
                    elif bitrate_kbps < 50:
                        self.consecutive_low_bitrate += 1
                        if self.consecutive_low_bitrate > 20: # ~10 seconds
                            fault_type = "bitrate_low"
                    else:
                        self.consecutive_low_bitrate = 0

                    if fault_type or (int(time.time()) % REPORT_INTERVAL == 0):
                        self.report_telemetry({
                            "node_id": self.node_id,
                            "tenant_id": self.tenant_id,
                            "bitrate_kbps": bitrate_kbps,
                            "latency_ms": latency_ms,
                            "frame_variance": frame_variance,
                            "avg_brightness": avg_brightness,
                            "fault_type": fault_type
                        })

            cap.release()

class HealthHandler(BaseHTTPRequestHandler):
    workers: List[CameraWorker] = []
    
    def do_GET(self):
        if self.path == '/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            
            data = {
                "status": "ok",
                "cameras": [{"id": w.id, "label": w.label, "status": w.status, "last_frame_at": w.last_frame_at} for w in self.workers]
            }
            self.wfile.write(json.dumps(data).encode())
        else:
            self.send_response(404)
            self.end_headers()

def run_health_server(workers: List[CameraWorker]):
    HealthHandler.workers = workers
    server = HTTPServer(('localhost', 9001), HealthHandler)
    server.serve_forever()

def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--config', required=True)
    args = parser.parse_args()

    with open(args.config, 'r') as f:
        cameras_config = json.load(f)

    workers = []
    for cfg in cameras_config:
        worker = CameraWorker(cfg)
        worker.start()
        workers.append(worker)

    # Start health server in a separate thread
    health_thread = threading.Thread(target=run_health_server, args=(workers,), daemon=True)
    health_thread.start()

    def signal_handler(sig, frame):
        print("\n[Vision] Shutting down...")
        for w in workers:
            w.running = False
        sys.exit(0)

    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    while True:
        time.sleep(1)

if __name__ == "__main__":
    main()
