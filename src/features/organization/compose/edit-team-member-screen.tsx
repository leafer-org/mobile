import { View } from 'react-native';

import { useEditInfoForm } from '../model/edit-info-form';
import { BackBar } from '../ui/back-bar';
import { DescriptionInput } from '../ui/edit-info/description-input';
import { Button } from '@/kernel/ui/button';
import { ScreenLayout } from '@/kernel/ui/screen-layout';
import { Text } from '@/kernel/ui/text';
import { TextInput } from '@/kernel/ui/text-input';

type Props = {
  organizationId: string;
  memberIndex: number;
  onBack: () => void;
  onRemoved: () => void;
};

export function EditTeamMemberScreen({ organizationId, memberIndex, onBack, onRemoved }: Props) {
  const form = useEditInfoForm(organizationId);
  const member = form.state.team.members[memberIndex];

  if (!member) {
    return (
      <ScreenLayout>
        <BackBar onBack={onBack} />
        <View className="gap-2 pt-2">
          <Text variant="body" color="secondary">
            Участник не найден.
          </Text>
        </View>
      </ScreenLayout>
    );
  }

  const handleRemove = () => {
    form.removeTeamMember(memberIndex);
    onRemoved();
  };

  return (
    <ScreenLayout keyboardAvoiding scrollable>
      <BackBar onBack={onBack} />
      <View className="gap-6 pb-8">
        <Text variant="h2">Участник</Text>

        <View className="gap-1.5">
          <Text variant="label">Имя</Text>
          <TextInput
            value={member.name}
            onChangeText={(v) => form.setTeamMember(memberIndex, { ...member, name: v })}
            placeholder="Имя и роль"
          />
        </View>

        <DescriptionInput
          value={member.description ?? ''}
          onChangeText={(v) => form.setTeamMember(memberIndex, { ...member, description: v })}
        />

        <Button variant="outline" onPress={handleRemove}>
          Удалить участника
        </Button>
      </View>
    </ScreenLayout>
  );
}
