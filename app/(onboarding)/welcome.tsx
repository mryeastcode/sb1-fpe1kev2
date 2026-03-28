import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Heart, Target, TrendingUp } from 'lucide-react-native';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#10B981', '#059669']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}>
        
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Heart color="#ffffff" size={64} />
          </View>
          
          <Text style={styles.title}>Welcome to FitTrack!</Text>
          <Text style={styles.subtitle}>
            Let's set up your profile to give you the best personalized experience
          </Text>
          
          <View style={styles.features}>
            <View style={styles.feature}>
              <Target color="#ffffff" size={24} />
              <Text style={styles.featureText}>Set personalized goals</Text>
            </View>
            <View style={styles.feature}>
              <TrendingUp color="#ffffff" size={24} />
              <Text style={styles.featureText}>Track your progress</Text>
            </View>
            <View style={styles.feature}>
              <Heart color="#ffffff" size={24} />
              <Text style={styles.featureText}>Stay motivated</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => router.push('/(onboarding)/personal-info')}>
            <Text style={styles.continueButtonText}>Let's Get Started</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
    marginBottom: 48,
  },
  features: {
    alignItems: 'flex-start',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 12,
    opacity: 0.9,
  },
  footer: {
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: '#10B981',
    fontSize: 18,
    fontWeight: '600',
  },
});