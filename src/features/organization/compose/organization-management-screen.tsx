import { useState } from 'react';

import { useOrganizationProfileViews } from '@/kernel/organization-profile';

import { resolveOrgStatus } from '../domain/resolve-org-status';
import { useMyOrganizations } from '../model/use-my-organizations';
import { ManagementMenuList } from '../ui/management-menu-list';
import { ManagementMenuRow } from '../ui/management-menu-row';
import { ScrollableBody } from '../ui/scrollable-body';
import { StatusBadge } from '../ui/status-badge';
import { OrgSwitcherSheet } from './org-switcher-sheet';

type Props = {
  orgId: string;
  onEdit: () => void;
  onSelectOrg: (orgId: string) => void;
  onCreateNewOrg: () => void;
};

export function OrganizationManagementScreen({
  orgId,
  onEdit,
  onSelectOrg,
  onCreateNewOrg,
}: Props) {
  const views = useOrganizationProfileViews();
  const myOrgs = useMyOrganizations();
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const listItem = myOrgs.data?.organizations.find((o) => o.id === orgId);
  const isLoading = myOrgs.isPending;
  const isError = myOrgs.isError;
  const status = listItem
    ? resolveOrgStatus({ isPublished: listItem.isPublished, draftStatus: listItem.draftStatus })
    : null;

  return (
    <>
      <views.ScreenLayout
        title={listItem?.name ?? 'Управление'}
        onTitlePress={listItem ? () => setSwitcherOpen(true) : undefined}
        body={
          isLoading ? (
            <views.LoadingState />
          ) : isError || !listItem || !status ? (
            <views.ErrorState message="Организация не найдена" />
          ) : (
            <ScrollableBody>
              <StatusBadge status={status} />
              <ManagementMenuList>
                <ManagementMenuRow
                  icon="create-outline"
                  label="Редактировать профиль"
                  onPress={onEdit}
                />
                <ManagementMenuRow
                  icon="swap-horizontal-outline"
                  label="Сменить организацию"
                  onPress={() => setSwitcherOpen(true)}
                />
              </ManagementMenuList>
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
    </>
  );
}
