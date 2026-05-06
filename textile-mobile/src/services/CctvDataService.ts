import { tcpService } from './TCPClientService';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * CCTV DATA SERVICE
 * High-speed security and vision telemetry engine.
 */
export class CctvDataService {
  /**
   * Fetches historical AI detection events.
   */
  public static async fetchDetectionHistory(params: {
    cameraNodeId?: string;
    detectedClass?: string;
    sinceTimestamp?: number;
    limit?: number;
  }) {
    const nodeId = await AsyncStorage.getItem('gs_node_id');
    const response = await tcpService.request({
      nsp: {
        detection_history_req: {
          node_id: nodeId,
          camera_node_id: params.cameraNodeId || '',
          detected_class: params.detectedClass || '',
          since_timestamp: params.sinceTimestamp || 0,
          limit: params.limit || 50
        }
      }
    });

    return response?.nsp?.detection_history_res || { events: [], total_count: 0 };
  }

  /**
   * Fetches the current status and telemetry of all CCTV nodes.
   */
  public static async fetchCameraStatus() {
    const nodeId = await AsyncStorage.getItem('gs_node_id');
    const response = await tcpService.request({
      nsp: {
        camera_status_req: {
          node_id: nodeId
        }
      }
    });

    return response?.nsp?.camera_status_res?.cameras || [];
  }
}
