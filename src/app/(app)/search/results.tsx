import { useLocalSearchParams } from 'expo-router';

import { SearchResultsScreen } from '@/features/discovery';

export default function SearchResultsRoute() {
  const { query } = useLocalSearchParams<{ query: string }>();
  return <SearchResultsScreen query={query ?? ''} />;
}
