import { ComponentType, createContext, ReactNode, useContext } from 'react';

import type { OrganizationProfile } from './types';

type ProfileSection = ComponentType<{ profile: OrganizationProfile }>;

export type OrganizationProfileViews = {
  // ── Section components (data-driven) ──
  Header: ComponentType<{ profile: OrganizationProfile; itemCount?: number }>;
  Description: ProfileSection;
  Gallery: ProfileSection;
  Contacts: ProfileSection;
  Team: ProfileSection;

  // ── Screen-level primitives (chrome / states) ──
  ScreenLayout: ComponentType<{
    title: string;
    onBack?: () => void;
    onTitlePress?: () => void;
    body: ReactNode;
  }>;
  LoadingState: ComponentType;
  ErrorState: ComponentType<{ message: string }>;
  SectionsStack: ComponentType<{ children: ReactNode }>;
  ItemsSectionCaption: ComponentType<{ count: number }>;
};

const OrganizationProfileViewsContext = createContext<OrganizationProfileViews | null>(null);

export function OrganizationProfileViewsProvider({
  views,
  children,
}: {
  views: OrganizationProfileViews;
  children: ReactNode;
}) {
  return (
    <OrganizationProfileViewsContext.Provider value={views}>
      {children}
    </OrganizationProfileViewsContext.Provider>
  );
}

export function useOrganizationProfileViews(): OrganizationProfileViews {
  const views = useContext(OrganizationProfileViewsContext);
  if (views === null) {
    throw new Error(
      'useOrganizationProfileViews must be used within OrganizationProfileViewsProvider',
    );
  }
  return views;
}
