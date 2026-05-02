import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';

import { encodeBreadcrumbs } from '../../domain/breadcrumb';
import { useAgeGroup } from '../../model/use-age-group';
import { AgeGroupToggle } from '../../ui/age-group-toggle';
import { DiscoveryHeader } from '../../ui/discovery-header';
import { DiscoveryScreenLayout } from '../../ui/discovery-screen-layout';
import { SearchStub } from '../../ui/search-stub';
import { useCategories } from '../model/use-categories';
import { CatalogBody } from '../ui/catalog-body';

type Props = {
  feedSlot?: ReactNode;
};

export function CatalogScreen({ feedSlot }: Props) {
  const router = useRouter();
  const { ageGroup, setAgeGroup } = useAgeGroup();
  const { data, isLoading } = useCategories();

  return (
    <DiscoveryScreenLayout
      header={
        <DiscoveryHeader
          searchSlot={<SearchStub />}
          ageGroupSlot={
            <AgeGroupToggle value={ageGroup} onChange={setAgeGroup} />
          }
        />
      }
      body={
        <CatalogBody
          isLoading={isLoading}
          categories={data ?? []}
          onCategoryPress={(cat) =>
            router.push({
              pathname: '/catalog/[categoryId]',
              params: {
                categoryId: cat.categoryId,
                categoryName: cat.name,
                breadcrumbs: encodeBreadcrumbs([
                  { id: cat.categoryId, name: cat.name },
                ]),
              },
            })
          }
          feedSlot={feedSlot}
        />
      }
    />
  );
}
