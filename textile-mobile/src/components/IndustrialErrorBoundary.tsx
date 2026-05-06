import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, DevSettings } from 'react-native';
import { AlertTriangle, RefreshCcw } from 'lucide-react-native';
import * as Updates from 'expo-updates';
import * as Haptics from 'expo-haptics';

interface Props {
  children: ReactNode;
  onError?: (error: Error) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class IndustrialErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('NODE FAULT DETECTED:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  private handleReboot = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    
    if (__DEV__) {
      DevSettings.reload();
    } else {
      try {
        await Updates.reloadAsync();
      } catch (e) {
        // Fallback for environments where Updates.reloadAsync might fail
        this.setState({ hasError: false, error: null });
      }
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <AlertTriangle size={64} color="#ea580c" strokeWidth={2.5} />
            </View>
            
            <Text style={styles.title}>NODE FAULT DETECTED</Text>
            
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>
                {this.state.error?.message || 'CRITICAL SYSTEM FAILURE'}
              </Text>
              <Text style={styles.subText}>
                STATION ID: GSG-NODE-01{"\n"}
                SUBSYSTEM: UI_LAYER{"\n"}
                STATUS: HALTED
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.rebootButton} 
              onPress={this.handleReboot}
              activeOpacity={0.7}
            >
              <RefreshCcw size={32} color="white" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>REBOOT NODE</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
              QUEUE PRESERVED IN ASYNC_STORAGE
            </Text>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b', // Deep Onyx
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: 'rgba(234, 88, 12, 0.1)',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(234, 88, 12, 0.3)',
  },
  title: {
    color: '#ea580c', // Deep Orange
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 4,
    marginBottom: 32,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Courier-Bold' : 'monospace',
  },
  errorBox: {
    width: '100%',
    backgroundColor: '#18181b',
    padding: 20,
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#ea580c',
    marginBottom: 48,
  },
  errorText: {
    color: '#f8fafc',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '700',
    marginBottom: 12,
  },
  subText: {
    color: '#71717a',
    fontSize: 12,
    lineHeight: 18,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  rebootButton: {
    backgroundColor: '#ea580c',
    width: '100%',
    height: 80, // Massive 80px button
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonIcon: {
    marginRight: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
  },
  footerText: {
    color: '#3f3f46',
    fontSize: 12,
    marginTop: 24,
    fontWeight: '700',
    letterSpacing: 1,
  }
});
