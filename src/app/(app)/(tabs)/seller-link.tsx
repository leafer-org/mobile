import { type Href, Redirect } from 'expo-router';

export default function SellerLinkRoute() {
  return <Redirect href={'/seller' as Href} />;
}
