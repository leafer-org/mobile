import { View } from 'react-native';

import { useEditInfoForm } from '../model/edit-info-form';
import { BackBar } from '../ui/back-bar';
import { TeamMemberRow } from '../ui/edit-info/team-member-row';
import { Button } from '@/kernel/ui/button';
import { ScreenLayout } from '@/kernel/ui/screen-layout';
import { Text } from '@/kernel/ui/text';
import { TextInput } from '@/kernel/ui/text-input';

type Props = {
  organizationId: string;
  onBack: () => void;
  onOpenMember: (index: number) => void;
};

export function EditTeamScreen({ organizationId, onBack, onOpenMember }: Props) {
  const form = useEditInfoForm(organizationId);
  const { state } = form;

  const handleAdd = () => {
    const index = form.addTeamMember();
    onOpenMember(index);
  };

  return (
    <ScreenLayout keyboardAvoiding scrollable>
      <BackBar onBack={onBack} />
      <View className="gap-6 pb-8">
        <Text variant="h2">Команда</Text>

        <View className="gap-1.5">
          <Text variant="label">Заголовок раздела</Text>
          <TextInput
            value={state.team.title}
            onChangeText={form.setTeamTitle}
            placeholder="Например: «Наша команда»"
          />
        </View>

        <View className="gap-2">
          <Text variant="label">Участники</Text>
          {state.team.members.length === 0 ? (
            <Text variant="caption">Пока нет участников</Text>
          ) : (
            <View className="gap-2">
              {state.team.members.map((member, index) => (
                <TeamMemberRow
                  key={member._localId}
                  name={member.name}
                  description={member.description}
                  onPress={() => onOpenMember(index)}
                  onRemove={() => form.removeTeamMember(index)}
                />
              ))}
            </View>
          )}
        </View>

        <Button variant="outline" onPress={handleAdd}>
          Добавить участника
        </Button>
      </View>
    </ScreenLayout>
  );
}
