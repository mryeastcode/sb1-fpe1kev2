import React, { createContext, useContext, useState, useCallback } from 'react';

export interface OnboardingData {
  dateOfBirth: string;
  gender: string;
  height: string;
  weight: string;
  activityLevel: string;
  goalType: string;
}

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  reset: () => void;
}

const defaultData: OnboardingData = {
  dateOfBirth: '',
  gender: '',
  height: '',
  weight: '',
  activityLevel: '',
  goalType: '',
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<OnboardingData>(defaultData);

  const updateData = useCallback((updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const reset = useCallback(() => {
    setData(defaultData);
  }, []);

  return (
    <OnboardingContext.Provider value={{ data, updateData, reset }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
