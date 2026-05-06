import type { PublicApiOperations } from '@/kernel/api';

type OrgDetailResponse =
  PublicApiOperations['getDiscoveryOrganizationDetail']['responses']['200']['content']['application/json'];

export type OrganizationProfile = OrgDetailResponse['profile'];
export type OrganizationContact = OrganizationProfile['contacts'][number];
