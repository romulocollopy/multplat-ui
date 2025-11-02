import { useEffect, useState } from 'react';
import type { FeatureFlags } from '../types';

export const useFeatureFlag = (flag: keyof FeatureFlags): boolean => {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Mock implementation - replace with your feature flag service
    const flags: FeatureFlags = {
      'new-onboarding-flow': true,
      'pricing-page-v2': false,
      'ai-suggestions': true,
    };
    setIsEnabled(flags[flag]);
  }, [flag]);

  return isEnabled;
};
