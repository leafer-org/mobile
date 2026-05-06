import { View } from 'react-native';

/**
 * Provides positioning context for absolutely-positioned overlays (FAB, etc.)
 * rendered as siblings to the main screen content.
 */
export function FloatingOverlayWrapper({
  children,
  overlays,
}: {
  children: React.ReactNode;
  overlays?: React.ReactNode;
}) {
  return (
    <View className="flex-1">
      {children}
      {overlays}
    </View>
  );
}
