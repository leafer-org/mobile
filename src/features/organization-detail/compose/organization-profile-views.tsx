import type { OrganizationProfileViews } from '@/kernel/organization-profile';

import { DetailScreenLayout } from '../ui/detail-screen-layout';
import { ErrorState } from '../ui/error-state';
import { ItemsSectionCaption } from '../ui/items-section-caption';
import { LoadingState } from '../ui/loading-state';
import { OrganizationContacts } from '../ui/organization-contacts';
import { OrganizationDescription } from '../ui/organization-description';
import { OrganizationGallery } from '../ui/organization-gallery';
import { OrganizationHeader } from '../ui/organization-header';
import { OrganizationTeam } from '../ui/organization-team';
import { ProfileSectionsStack } from '../ui/profile-sections-stack';

export const organizationProfileViews: OrganizationProfileViews = {
  Header: OrganizationHeader,
  Description: OrganizationDescription,
  Gallery: OrganizationGallery,
  Contacts: OrganizationContacts,
  Team: OrganizationTeam,
  ScreenLayout: DetailScreenLayout,
  LoadingState,
  ErrorState,
  SectionsStack: ProfileSectionsStack,
  ItemsSectionCaption,
};
