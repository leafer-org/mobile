import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  isLiked: boolean;
  onPress: () => void;
};

export function LikeButton({ isLiked, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={8}
      activeOpacity={0.7}
      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/30 items-center justify-center"
    >
      <Ionicons
        name={isLiked ? 'heart' : 'heart-outline'}
        size={16}
        color={isLiked ? '#f43f5e' : '#ffffff'}
      />
    </TouchableOpacity>
  );
}
