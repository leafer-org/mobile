import { useState } from 'react';

import { useOrganizationProfileViews } from '@/kernel/organization-profile';

import { toOrganizationProfile } from '../domain/to-organization-profile';
import { useMyOrganizations } from '../model/use-my-organizations';
import { useOrganization } from '../model/use-organization';
import { EditFab } from '../ui/edit-fab';
import { FloatingOverlayWrapper } from '../ui/floating-overlay-wrapper';
import { ScrollableBody } from '../ui/scrollable-body';
import { OrgSwitcherSheet } from './org-switcher-sheet';

type Props = {
  orgId: string;
  onEdit: () => void;
  onSelectOrg: (orgId: string) => void;
  onCreateNewOrg: () => void;
};

/**
 * Превью профиля организации в admin-флоу — рендерит то же самое, что
 * увидит обычный пользователь на публичной странице, плюс floating FAB
 * для перехода на страницу редактирования. Тап по имени в шапке —
 * bottom-sheet со списком организаций.
 */
export function OrganizationProfileScreen({
  orgId,
  onEdit,
  onSelectOrg,
  onCreateNewOrg,
}: Props) {
  const views = useOrganizationProfileViews();
  const myOrgs = useMyOrganizations();
  const orgQuery = useOrganization(orgId);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const listItem = myOrgs.data?.organizations.find((o) => o.id === orgId);
  const detail = orgQuery.data;
  const isLoading = myOrgs.isPending || orgQuery.isPending;
  const isError = myOrgs.isError || orgQuery.isError;
  const profile = detail && listItem ? toOrganizationProfile(detail, listItem.avatarUrl) : null;

  return (
    <FloatingOverlayWrapper overlays={profile && <EditFab onPress={onEdit} />}>
      <views.ScreenLayout
        title={profile?.name ?? ''}
        onTitlePress={profile ? () => setSwitcherOpen(true) : undefined}
        body={
          isLoading ? (
            <views.LoadingState />
          ) : isError || !profile ? (
            <views.ErrorState message="Организация не найдена" />
          ) : (
            <ScrollableBody>
              <views.SectionsStack>
                <views.Header profile={profile} />
                <views.Description profile={profile} />
                <views.Gallery profile={profile} />
                <views.Contacts profile={profile} />
                <views.Team profile={profile} />
              </views.SectionsStack>
            </ScrollableBody>
          )
        }
      />
      <OrgSwitcherSheet
        visible={switcherOpen}
        activeOrgId={orgId}
        onClose={() => setSwitcherOpen(false)}
        onSelect={(id) => {
          setSwitcherOpen(false);
          onSelectOrg(id);
        }}
        onCreateNew={() => {
          setSwitcherOpen(false);
          onCreateNewOrg();
        }}
      />
    </FloatingOverlayWrapper>
  );
}
