import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

export default function Index() {
  const { user, loading } = useAuth();
  const [isReady, setIsReady] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('date_of_birth, gender, height_cm')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Profile check error:', error);
            setHasProfile(false);
          } else {
            // Check if profile is complete (has essential onboarding data)
            const isComplete = data?.date_of_birth && data?.gender && data?.height_cm;
            setHasProfile(!!isComplete);
          }
        } catch (error) {
          console.error('Profile check error:', error);
          setHasProfile(false);
        }
      }
      setCheckingProfile(false);
      setIsReady(true);
    };

    if (!loading) {
      checkUserProfile();
    }
  }, [user, loading]);

  if (loading || !isReady || checkingProfile) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (user) {
    if (hasProfile) {
      return <Redirect href="/(tabs)" />;
    } else {
      return <Redirect href="/(onboarding)/welcome" />;
    }
  }

  return <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
});