import { useRouter } from 'expo-router';

import { ItemCard } from '@/features/discovery/_item-card';
import { ItemList } from '@/features/discovery/ui/item-list';
import { useOrganizationProfileViews } from '@/kernel/organization-profile';
import { useLikedStatus } from '@/support/like';

import { useOrganizationDetail } from '../model/use-organization-detail';

export function OrganizationDetailScreen({ orgId }: { orgId: string }) {
  const router = useRouter();
  const views = useOrganizationProfileViews();
  const query = useOrganizationDetail(orgId);
  const items = query.data?.items ?? [];
  const profile = query.data?.profile;
  const liked = useLikedStatus(items.map((i) => i.itemId));

  return (
    <views.ScreenLayout
      title={profile?.name ?? ''}
      onBack={() => router.back()}
      body={
        query.isLoading ? (
          <views.LoadingState />
        ) : query.isError || !profile ? (
          <views.ErrorState message="Не удалось загрузить организацию" />
        ) : (
          <ItemList
            items={items}
            isLoading={false}
            isFetchingNextPage={false}
            hasNextPage={false}
            onEndReached={() => undefined}
            onRefresh={() => query.refetch()}
            isRefreshing={query.isRefetching}
            ListHeaderComponent={
              <views.SectionsStack>
                <views.Header profile={profile} itemCount={items.length} />
                <views.Description profile={profile} />
                <views.Gallery profile={profile} />
                <views.Contacts profile={profile} />
                <views.Team profile={profile} />
                <views.ItemsSectionCaption count={items.length} />
              </views.SectionsStack>
            }
            renderItem={(item, { isVisible }) => (
              <ItemCard
                item={item}
                isVisible={isVisible}
                isLiked={liked.data?.has(item.itemId) ?? false}
              />
            )}
          />
        )
      }
    />
  );
}
