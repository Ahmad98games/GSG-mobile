import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';
import { useMovementStore, type LocationPoint } from '../../store/MovementStore';
import { tcpService } from '../../services/TCPClientService';
import { ModelManager } from '../../services/ModelManager';
import { THEME } from '../../constants/DesignSystem';
import * as Notifications from 'expo-notifications';

/**
 * NOXIS PATHFINDER
 * Industrial GIS and Logistics coordination engine.
 * [NoxisPathFinder / MapLibre]
 */

const FACTORY_PERIMETER = {
  latitude: 28.6139,
  longitude: 77.2090,
  radius: 1000,
};

export class NoxisPathFinder {
  private static locationSubscription: Location.LocationSubscription | null = null;
  private static sensorSubscription: any = null;
  private static isMoving = true;
  private static movementHistory: boolean[] = [];

  /**
   * Initializes the GIS engine and Battery Guard.
   */
  public static async initialize() {
    console.log('[NoxisPathFinder / MapLibre] INITIALIZING');

    // 1. Permission Check
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('[NoxisPathFinder / MapLibre] PERMISSION_DENIED: Location required.');
      return;
    }

    // 2. Ensure Maps Ready
    const mapPath = await ModelManager.getModelPath('maps');
    if (!mapPath) {
      console.log('[NoxisPathFinder / MapLibre] MAP_TILES_MISSING: Initiating download...');
      await ModelManager.downloadModel('maps');
    }

    // 3. Battery Guard: 30s Window Stationary Detection
    this.sensorSubscription = Accelerometer.addListener(({ x, y, z }: { x: number; y: number; z: number }) => {
      const movement = Math.sqrt(x * x + y * y + z * z);
      const currentlyMoving = movement > 1.1;
      
      this.movementHistory.push(currentlyMoving);
      if (this.movementHistory.length > 6) { // 30s at 5s interval
        this.movementHistory.shift();
        const wasMoving = this.movementHistory.some(m => m === true);
        
        if (wasMoving !== this.isMoving) {
          this.isMoving = wasMoving;
          this.adjustPollingRate();
        }
      }
    });

    Accelerometer.setUpdateInterval(5000);
    this.adjustPollingRate();
  }

  private static async adjustPollingRate() {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
    }

    if (!this.isMoving) {
      console.log('[NoxisPathFinder / MapLibre] BATTERY_GUARD: Device stationary for 30s. Pausing GPS.');
      return;
    }

    this.locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 300000,
        distanceInterval: 50,
      },
      (location: Location.LocationObject) => this.handleLocationUpdate(location)
    );
  }

  private static async handleLocationUpdate(location: Location.LocationObject) {
    const { latitude, longitude, speed } = location.coords;

    // 4. Coordinate Validation
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180 || (latitude === 0 && longitude === 0)) {
      console.warn('[NoxisPathFinder / MapLibre] INVALID_COORDINATES_DROPPED:', { latitude, longitude });
      return;
    }

    const isInside = this.checkGeofence(latitude, longitude);
    
    const point: LocationPoint = {
      latitude,
      longitude,
      speed: speed || 0,
      timestamp: location.timestamp,
      isSynced: false,
    };

    // 5. FIFO Cache Limit: 10,000 rows (Handled by Store)
    useMovementStore.getState().updateLocation(point);

    if (!isInside) {
      await this.triggerSecurityAlert('PERIMETER_BREACH', 'Vehicle has left factory bounds.');
    }

    this.attemptSync(point);
  }

  private static checkGeofence(lat: number, lon: number): boolean {
    const dLat = (lat - FACTORY_PERIMETER.latitude) * Math.PI / 180;
    const dLon = (lon - FACTORY_PERIMETER.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(FACTORY_PERIMETER.latitude * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = 6371e3 * c;
    
    return distance <= FACTORY_PERIMETER.radius;
  }

  private static async attemptSync(point: LocationPoint) {
    if (tcpService.getStatus()) {
      tcpService.sendMessage({
        t: 'LOCATION_UPDATE',
        lat: point.latitude,
        lon: point.longitude,
        ts: point.timestamp,
      });
      useMovementStore.getState().markAsSynced(point.timestamp);
    }
  }

  private static async triggerSecurityAlert(title: string, body: string) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `⚠️ ${title}`,
        body: body,
        color: THEME.colors.horror.neonRed,
      },
      trigger: null,
    });
  }
}
