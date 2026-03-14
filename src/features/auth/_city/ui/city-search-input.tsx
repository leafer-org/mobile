import { TextInput } from '@/kernel/ui/text-input';

export function CitySearchInput({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (text: string) => void;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder="Поиск города..."
      autoCorrect={false}
    />
  );
}
