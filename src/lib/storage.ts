import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

export const storage = {
  getItem: (key: string): string | null => {
    if (isWeb) return localStorage.getItem(key);
    return SecureStore.getItem(key);
  },
  setItem: (key: string, value: string): void => {
    if (isWeb) {
      localStorage.setItem(key, value);
      return;
    }
    SecureStore.setItem(key, value);
  },
  deleteItem: async (key: string): Promise<void> => {
    if (isWeb) {
      localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};
