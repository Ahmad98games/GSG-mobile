import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { THEME } from '../src/constants/theme';
import { ShieldAlert, CreditCard, ExternalLink } from 'lucide-react-native';
import { useAuthStore } from '../src/store/AuthStore';

export default function LicenseExpired() {
  const { logout } = useAuthStore();

  return (
    <View style={styles.container}>
      <ShieldAlert size={80} color={THEME.colors.critical} />
      
      <Text style={styles.title}>LICENSE_EXPIRED</Text>
      <Text style={styles.subtitle}>HARDWARE_RESOURCES_LOCKED</Text>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          YOUR NOXIS SENTINEL SUBSCRIPTION HAS ENDED. 
          ALL CCTV NODES AND COMMAND UNIT FEATURES ARE AUTOMATICALLY DISABLED TO ENSURE NETWORK INTEGRITY.
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.renewBtn}
        onPress={() => Linking.openURL('https://noxis.omnora.com/pricing')}
      >
        <CreditCard size={20} color="white" />
        <Text style={styles.renewText}>RENEW_SUBSCRIPTION_NOW</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.logoutBtn}
        onPress={() => logout()}
      >
        <Text style={styles.logoutText}>SIGN_OUT_OF_NODE</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>SECURED BY OMNORA LABS — v11.5 HARDENED</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  title: {
    fontFamily: THEME.fonts.monoExtraBold,
    color: 'white',
    fontSize: 28,
    marginTop: 24,
    letterSpacing: 2,
  },
  subtitle: {
    fontFamily: THEME.fonts.monoBold,
    color: THEME.colors.critical,
    fontSize: 14,
    marginTop: 8,
    letterSpacing: 1,
  },
  infoBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    padding: 20,
    borderRadius: 12,
    marginTop: 40,
    width: '100%',
  },
  infoText: {
    fontFamily: THEME.fonts.mono,
    color: THEME.colors.textSecondary,
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 18,
  },
  renewBtn: {
    backgroundColor: THEME.colors.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 60,
    width: '100%',
    gap: 12,
  },
  renewText: {
    fontFamily: THEME.fonts.monoExtraBold,
    color: 'white',
    fontSize: 12,
  },
  logoutBtn: {
    marginTop: 24,
    padding: 12,
  },
  logoutText: {
    fontFamily: THEME.fonts.monoBold,
    color: THEME.colors.textSecondary,
    fontSize: 11,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
  },
  footerText: {
    fontFamily: THEME.fonts.mono,
    color: THEME.colors.border,
    fontSize: 8,
    letterSpacing: 1,
  }
});
