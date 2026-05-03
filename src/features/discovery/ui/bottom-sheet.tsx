import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Dimensions, Modal, Pressable } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const ANIM_DURATION = 220;

type Props = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function BottomSheet({ visible, onClose, children }: Props) {
  const [isMounted, setIsMounted] = useState(visible);
  const fadeAnim = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const slideAnim = useRef(new Animated.Value(visible ? 0 : SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) setIsMounted(false);
      });
    }
  }, [visible, fadeAnim, slideAnim]);

  if (!isMounted) return null;

  return (
    <Modal transparent visible animationType="none" onRequestClose={onClose}>
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          opacity: fadeAnim,
        }}
      >
        <Pressable style={{ flex: 1, justifyContent: 'flex-end' }} onPress={onClose}>
          <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
            <Pressable onPress={(e) => e.stopPropagation()}>{children}</Pressable>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </Modal>
  );
}
