import requests
import subprocess
import time
import os
import sys
import logging

# CONFIGURATION
HEALTH_URL = "http://localhost:9001/health"
ENGINE_SCRIPT = "src/vision/vision_engine.py"
CONFIG_PATH = "cameras.json"
LOG_FILE = "logs/vision-watchdog.log"

# Setup logging
os.makedirs("logs", exist_ok=True)
logging.basicConfig(
    filename=LOG_FILE,
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s'
)

def start_engine():
    logging.info("Starting Vision Engine sidecar...")
    return subprocess.Popen([
        sys.executable, ENGINE_SCRIPT,
        "--config", CONFIG_PATH
    ])

def main():
    engine_process = start_engine()
    consecutive_failures = 0
    restarts_this_hour = 0
    hour_start = time.time()

    while True:
        try:
            # Check if process is still running
            if engine_process.poll() is not None:
                logging.error("Vision Engine process exited unexpectedly.")
                consecutive_failures = 3 # Trigger restart
            else:
                response = requests.get(HEALTH_URL, timeout=5)
                if response.status_code == 200:
                    consecutive_failures = 0
                else:
                    consecutive_failures += 1
        except Exception as e:
            consecutive_failures += 1
            logging.warning(f"Health check failed: {e}")

        if consecutive_failures >= 3:
            logging.error("Watchdog: Vision Engine unresponsive. Restarting...")
            
            # Reset restart counter if hour has passed
            if time.time() - hour_start > 3600:
                restarts_this_hour = 0
                hour_start = time.time()

            if restarts_this_hour < 5:
                if engine_process.poll() is None:
                    engine_process.terminate()
                    engine_process.wait()
                
                engine_process = start_engine()
                restarts_this_hour += 1
                consecutive_failures = 0
                logging.info(f"Restart successful. Total restarts this hour: {restarts_this_hour}")
            else:
                logging.critical("MAX RESTARTS REACHED. Operator intervention required.")
                # Here you could write to Supabase if service key is available
                time.sleep(60) # Wait before trying again

        time.sleep(15)

if __name__ == "__main__":
    main()
