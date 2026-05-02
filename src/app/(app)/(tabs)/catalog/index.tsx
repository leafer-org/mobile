import { CatalogScreen, FeedPreview } from '@/features/discovery';

export default function CatalogRoute() {
  return <CatalogScreen feedSlot={<FeedPreview />} />;
}
