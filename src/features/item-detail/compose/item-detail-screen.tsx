import { ActivityIndicator, ScrollView, View } from 'react-native';

import { useItemDetail } from '../model/use-item-detail';
import { BaseInfoWidget } from '../ui/widgets/base-info-widget';
import { ContactInfoWidget } from '../ui/widgets/contact-info-widget';
import { LocationWidget } from '../ui/widgets/location-widget';
import { OwnerWidget } from '../ui/widgets/owner-widget';
import { PaymentWidget } from '../ui/widgets/payment-widget';
import { ReviewWidget } from '../ui/widgets/review-widget';
import { ScheduleWidget } from '../ui/widgets/schedule-widget';
import { TeamWidget } from '../ui/widgets/team-widget';
import { Text } from '@/kernel/ui/text';

export function ItemDetailScreen({ itemId }: { itemId: string }) {
  const { data, isLoading, isError } = useItemDetail(itemId);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-slate-900">
        <ActivityIndicator size="large" color="#0d9488" />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-slate-900 px-6">
        <Text variant="h3">Товар не найден</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white dark:bg-slate-900">
      <View className="gap-4 pb-8">
        {data.widgets.map((widget, i) => (
          <WidgetRenderer key={i} widget={widget} />
        ))}
      </View>
    </ScrollView>
  );
}

function WidgetRenderer({ widget }: { widget: Record<string, unknown> }) {
  const type = widget.type as string;

  switch (type) {
    case 'base-info':
      return (
        <BaseInfoWidget
          title={widget.title as string}
          description={widget.description as string}
          media={(widget.media as []) ?? []}
        />
      );
    case 'payment':
      return <PaymentWidget options={(widget.options as []) ?? []} />;
    case 'owner':
      return (
        <OwnerWidget
          name={widget.name as string}
          avatarUrl={widget.avatarUrl as string | null}
        />
      );
    case 'item-review':
      return (
        <ReviewWidget
          label="отзывов"
          rating={widget.rating as number | null}
          reviewCount={widget.reviewCount as number}
        />
      );
    case 'owner-review':
      return (
        <ReviewWidget
          label="отзывов об организации"
          rating={widget.rating as number | null}
          reviewCount={widget.reviewCount as number}
        />
      );
    case 'location':
      return <LocationWidget address={widget.address as string | null} />;
    case 'schedule':
      return <ScheduleWidget entries={(widget.entries as []) ?? []} />;
    case 'contact-info':
      return <ContactInfoWidget contacts={(widget.contacts as []) ?? []} />;
    case 'team':
      return <TeamWidget title={widget.title as string} members={(widget.members as []) ?? []} />;
    default:
      return null;
  }
}
