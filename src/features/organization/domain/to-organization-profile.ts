import type { PublicApiOperations } from '@/kernel/api';
import type { OrganizationProfile } from '@/kernel/organization-profile';

type OrganizationDetail =
  PublicApiOperations['getOrganization']['responses']['200']['content']['application/json'];

/**
 * Adapts the seller-side OrganizationDetail (with infoDraft) to the kernel
 * OrganizationProfile shape used by OrganizationProfileViews.
 *
 * `avatarUrl` is taken separately because backend returns it resolved on
 * OrganizationListItem but only as `avatarId` here.
 */
export function toOrganizationProfile(
  detail: OrganizationDetail,
  avatarUrl: string | null,
): OrganizationProfile {
  const info = detail.infoDraft;
  return {
    organizationId: detail.id,
    name: info.name,
    description: info.description,
    avatarId: info.avatarId ?? null,
    avatarUrl,
    media: info.media,
    contacts: info.contacts ?? [],
    team: info.team
      ? {
          title: info.team.title ?? '',
          members: (info.team.members ?? []).map((m) => ({
            name: m.name,
            description: m.description ?? null,
            avatarUrl: null,
            employeeUserId: m.employeeUserId ?? null,
          })),
        }
      : null,
    rating: null,
    reviewCount: 0,
  };
}
