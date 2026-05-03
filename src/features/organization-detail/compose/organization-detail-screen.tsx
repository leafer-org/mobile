import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ItemCard } from '@/features/discovery/_item-card';
import { ItemList } from '@/features/discovery/ui/item-list';
import { Text } from '@/kernel/ui/text';
import { useLikedStatus } from '@/support/like';

import { useOrganizationDetail } from '../model/use-organization-detail';
import { OrganizationContacts } from '../ui/organization-contacts';
import { OrganizationGallery } from '../ui/organization-gallery';
import { OrganizationHeader } from '../ui/organization-header';
import { OrganizationTeam } from '../ui/organization-team';

type Props = {
  orgId: string;
};

export function OrganizationDetailScreen({ orgId }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === 'dark';
  const iconColor = isDark ? '#a8a29e' : '#78716c';

  const query = useOrganizationDetail(orgId);
  const items = query.data?.items ?? [];
  const itemIds = items.map((i) => i.itemId);
  const liked = useLikedStatus(itemIds);

  const profile = query.data?.profile;

  return (
    <View className="flex-1 bg-stone-50 dark:bg-stone-900">
      <View
        className="bg-white dark:bg-stone-900 px-3 pb-2 flex-row items-center gap-2"
        style={{ paddingTop: insets.top + 12 }}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Назад"
        >
          <Ionicons name="arrow-back" size={22} color={iconColor} />
        </Pressable>
        <Text
          numberOfLines={1}
          className="flex-1 text-base font-medium text-stone-900 dark:text-white"
        >
          {profile?.name ?? ''}
        </Text>
      </View>

      {query.isLoading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color={iconColor} />
        </View>
      )}

      {query.isError && (
        <View className="flex-1 items-center justify-center px-6 gap-2">
          <Text className="text-sm text-stone-500 dark:text-stone-400">
            Не удалось загрузить организацию
          </Text>
        </View>
      )}

      {profile && (
        <ItemList
          items={items}
          isLoading={false}
          isFetchingNextPage={false}
          hasNextPage={false}
          onEndReached={() => undefined}
          onRefresh={() => query.refetch()}
          isRefreshing={query.isRefetching}
          ListHeaderComponent={
            <View>
              <OrganizationHeader
                name={profile.name}
                avatarUrl={profile.avatarUrl ?? null}
                rating={profile.rating ?? null}
                reviewCount={profile.reviewCount}
                itemCount={items.length}
              />
              {profile.description && profile.description.length > 0 && (
                <View className="px-4 pt-1 pb-3">
                  <Text className="text-sm text-stone-700 dark:text-stone-200 leading-5">
                    {profile.description}
                  </Text>
                </View>
              )}
              {profile.media.length > 0 && (
                <View className="pb-3">
                  <OrganizationGallery media={profile.media as never} />
                </View>
              )}
              <OrganizationContacts contacts={profile.contacts} />
              {profile.team && (
                <OrganizationTeam
                  title={profile.team.title}
                  members={(profile.team.members ?? []).map((m) => ({
                    name: m.name,
                    description: m.description ?? null,
                    avatarUrl: m.avatarUrl ?? null,
                  }))}
                />
              )}
              {items.length > 0 && (
                <Text className="px-4 pt-5 pb-2 text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Товары
                </Text>
              )}
            </View>
          }
          renderItem={(item, { isVisible }) => (
            <ItemCard
              item={item}
              isVisible={isVisible}
              isLiked={liked.data?.has(item.itemId) ?? false}
            />
          )}
        />
      )}
    </View>
  );
}
