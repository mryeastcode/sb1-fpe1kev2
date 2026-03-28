import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { OnboardingProvider } from '@/contexts/OnboardingContext';

export default function RootLayout() {
  return (
    <OnboardingProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </OnboardingProvider>
  );
}