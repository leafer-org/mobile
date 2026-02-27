import Constants from 'expo-constants';

import { env } from '../env';

export function getExpoDevServerHost(): string | null {
  const hostUri = Constants.expoConfig?.hostUri;

  if (!hostUri) return null;
  const [host] = hostUri.replace(/^https?:\/\//, '').split(':');
  return host;
}

export const normalizeServerUrl = (url: string): string => {
  if (env.NODE_ENV === 'development') {
    return url.replace('localhost', getExpoDevServerHost() ?? 'localhost');
  }
  return url;
};
