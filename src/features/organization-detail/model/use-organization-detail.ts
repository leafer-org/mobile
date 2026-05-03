import { useQuery } from '@tanstack/react-query';
import { PixelRatio } from 'react-native';

import type { ItemListView } from '@/features/discovery/domain/types';
import type { PublicApiOperations } from '@/kernel/api';
import { useApiFetchClient } from '@/kernel/api/provider';

type RawResponse =
  PublicApiOperations['getDiscoveryOrganizationDetail']['responses']['200']['content']['application/json'];

export type OrganizationProfile = RawResponse['profile'];
export type OrganizationContact = OrganizationProfile['contacts'][number];

export type OrganizationDetailData = {
  profile: OrganizationProfile;
  items: ItemListView[];
};

export function useOrganizationDetail(orgId: string) {
  const fetchClient = useApiFetchClient();
  const dpr = PixelRatio.get();

  return useQuery({
    enabled: orgId.length > 0,
    queryKey: ['organization-detail', orgId],
    queryFn: async (): Promise<OrganizationDetailData> => {
      const res = await fetchClient.GET('/orgs/{orgId}', {
        params: {
          path: { orgId },
          header: { 'X-Device-DPR': dpr },
        },
      });
      const data = res.data as RawResponse;
      return {
        profile: data.profile,
        items: data.items as ItemListView[],
      };
    },
  });
}
