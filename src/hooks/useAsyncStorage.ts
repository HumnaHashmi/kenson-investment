/**
 * Simple hook wrapper for AsyncStorage.
 * Install: yarn add @react-native-async-storage/async-storage
 */
import { useState, useEffect, useCallback } from 'react';

// Placeholder — replace with real AsyncStorage import once installed
const AsyncStorage = {
  getItem: async (_key: string) => null as string | null,
  setItem: async (_key: string, _value: string) => {},
  removeItem: async (_key: string) => {},
};

export function useAsyncStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(key).then(value => {
      if (value !== null) setStoredValue(JSON.parse(value));
      setLoading(false);
    });
  }, [key]);

  const setValue = useCallback(
    async (value: T) => {
      setStoredValue(value);
      await AsyncStorage.setItem(key, JSON.stringify(value));
    },
    [key],
  );

  const removeValue = useCallback(async () => {
    setStoredValue(initialValue);
    await AsyncStorage.removeItem(key);
  }, [key, initialValue]);

  return { value: storedValue, setValue, removeValue, loading };
}
