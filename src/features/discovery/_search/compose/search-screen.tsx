import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FeedPreview } from '../../_feed';
import { useAgeGroup } from '../../model/use-age-group';
import { useRecentSearches } from '../model/use-recent-searches';
import { useSearchSuggestions } from '../model/use-search-suggestions';
import { RecentChip } from '../ui/recent-chip';
import { SearchInput } from '../ui/search-input';
import { SuggestionSection } from '../ui/suggestion-section';
import {
  ItemSuggestionRow,
  OrganizationSuggestionRow,
  SuggestionRow,
} from '../ui/suggestion-row';
import { Text } from '@/kernel/ui/text';
import { useCity } from '@/support/city';

function SuggestionDivider() {
  return <View className="h-px bg-stone-100 dark:bg-stone-800 mx-4 my-1" />;
}

export function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { cityId } = useCity();
  const { ageGroup } = useAgeGroup();
  const { recents, remember, remove, clear } = useRecentSearches();

  const [query, setQuery] = useState('');
  const trimmed = query.trim();

  const suggestions = useSearchSuggestions({ query, cityId, ageGroup });

  const goToResults = useCallback(
    (text: string) => {
      const q = text.trim();
      if (q.length === 0) return;
      remember(q);
      router.push({ pathname: '/search/results', params: { query: q } });
    },
    [remember, router],
  );

  const data = suggestions.data;
  const hasQuery = trimmed.length > 0;
  const hasMatches =
    hasQuery &&
    ((data?.categories.length ?? 0) > 0 ||
      (data?.itemTypes.length ?? 0) > 0 ||
      (data?.organizations.length ?? 0) > 0 ||
      (data?.items.length ?? 0) > 0);

  // Бэк уже фильтрует popularQueries по подстроке и исключает точное совпадение —
  // на топ кладём то, что вводит пользователь.
  const querySuggestions = hasQuery
    ? [trimmed, ...(data?.popularQueries ?? []).map((q) => q.text)]
    : [];

  return (
    <View className="flex-1 bg-white dark:bg-stone-900">
      <View
        className="bg-white dark:bg-stone-900 px-3 pb-2"
        style={{ paddingTop: insets.top + 12 }}
      >
        <SearchInput
          value={query}
          onChangeText={setQuery}
          onBackPress={() => router.back()}
          onSubmit={() => goToResults(query)}
          autoFocus
        />
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      >
        {!hasQuery && recents.length > 0 && (
          <SuggestionSection
            title="Недавние"
            action={{ label: 'Очистить', onPress: clear }}
          >
            <View className="flex-row flex-wrap gap-2 px-4 py-1">
              {recents.map((text) => (
                <RecentChip
                  key={`recent-${text}`}
                  text={text}
                  onPress={() => goToResults(text)}
                  onRemove={() => remove(text)}
                />
              ))}
            </View>
          </SuggestionSection>
        )}

        {querySuggestions.map((text, idx) => {
          const isUserQuery = hasQuery && idx === 0;
          return (
            <SuggestionRow
              key={`q-${idx}-${text}`}
              icon={isUserQuery ? 'search-outline' : undefined}
              title={isUserQuery ? `Искать «${text}»` : text}
              onPress={() => goToResults(text)}
              testID={isUserQuery ? 'search-submit-row' : undefined}
            />
          );
        })}

        {hasQuery && hasMatches && <SuggestionDivider />}

        {data?.categories.map((c) => (
          <SuggestionRow
            key={`cat-${c.categoryId}`}
            icon="grid-outline"
            title={c.name}
            onPress={() =>
              router.replace({
                pathname: '/catalog/[categoryId]',
                params: { categoryId: c.categoryId, categoryName: c.name },
              })
            }
          />
        ))}

        {data?.itemTypes.map((t) => (
          <SuggestionRow
            key={`type-${t.typeId}`}
            icon="cube-outline"
            title={t.name}
            onPress={() => goToResults(t.name)}
          />
        ))}

        {data?.organizations.map((o) => (
          <OrganizationSuggestionRow
            key={`org-${o.organizationId}`}
            name={o.name}
            avatarUrl={o.avatarUrl ?? null}
            onPress={() =>
              router.replace({
                pathname: '/organizations/[orgId]',
                params: { orgId: o.organizationId },
              })
            }
          />
        ))}

        {data?.items.map((item) => (
          <ItemSuggestionRow
            key={`item-${item.itemId}`}
            item={item}
            onPress={() =>
              router.replace({
                pathname: '/items/[itemId]',
                params: { itemId: item.itemId },
              })
            }
          />
        ))}

        {hasQuery && !suggestions.isLoading && !hasMatches && (
          <View className="px-4 py-8 items-center">
            <Text className="text-sm text-stone-500 dark:text-stone-400">
              Нажмите «Искать», чтобы посмотреть все совпадения.
            </Text>
          </View>
        )}

        {!hasQuery && (
          <View className="pt-2">
            <Text className="px-4 pt-3 pb-1 text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Может быть интересно
            </Text>
            <FeedPreview />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
