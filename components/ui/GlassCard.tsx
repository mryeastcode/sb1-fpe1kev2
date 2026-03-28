import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface GlassCardProps {
  children: React.ReactNode;
  style?: any;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  border?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  style, 
  intensity = 60, 
  tint = 'light',
  border = true
}) => {
  return (
    <View style={[styles.container, style]}>
      {Platform.OS === 'ios' ? (
        <BlurView 
          intensity={intensity} 
          tint={tint}
          style={[styles.blurView, border && styles.border]}
        >
          {children}
        </BlurView>
      ) : (
        // Android fallback (BlurView is limited on Android Expo Go)
        <View style={[styles.androidFallback, border && styles.border]}>
          {children}
        </View>
      )}
    </View>
  );
};

// 3D Icon Wrapper to add depth/shadow
export const Icon3DWrapper: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = "#fff" }) => {
  return (
    <View style={styles.iconWrapper}>
      <View style={[styles.iconShadow, { backgroundColor: color, opacity: 0.4 }]} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  blurView: {
    borderRadius: 24,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Slight white tint
  },
  androidFallback: {
    borderRadius: 24,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  border: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 8,
  },
  iconShadow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    blurRadius: 10,
  },
});
