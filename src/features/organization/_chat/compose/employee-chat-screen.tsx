import { useMemo } from 'react';

import { useAnyPending } from '@/lib/react/use-any-pending';
import {
  type ChatStatus,
  EditMessageModal,
  MessageList,
  useChatDetail,
  useChatMessages,
  useChatRealtime,
  useMarkRead,
} from '@/support/chat';
import { useMe } from '@/support/user';

import { formatChatSubtitle, formatChatTitle } from '../domain/chat-title';
import { flattenMessagePages } from '../domain/messages';
import { findOrgSlot, getMyParticipantId } from '../domain/org-slot';
import { useBlockChat, useUnblockChat } from '../model/use-block-chat';
import { useCloseChat } from '../model/use-close-chat';
import { useMessageContextMenu } from '../model/use-message-context-menu';
import { useReleaseSlot } from '../model/use-release-slot';
import { useSendAsEmployee } from '../model/use-send-as-employee';
import { EmployeeActionsBar } from '../ui/employee-actions-bar';
import { EmployeeChatBackButton } from '../ui/employee-chat-back-button';
import { EmployeeChatComposer } from '../ui/employee-chat-composer';
import { EmployeeChatHeader } from '../ui/employee-chat-header';
import { EmployeeChatLayout } from '../ui/employee-chat-layout';
import { EmployeeChatLoading } from '../ui/employee-chat-loading';

type Props = {
  chatId: string;
  organizationId: string;
  onBack?: () => void;
};

export function EmployeeChatScreen({ chatId, organizationId, onBack }: Props) {
  const me = useMe();
  const detail = useChatDetail(chatId);
  const messages = useChatMessages(chatId);
  const { markRead } = useMarkRead(chatId);
  useChatRealtime(chatId);

  const sendMutation = useSendAsEmployee();
  const releaseMutation = useReleaseSlot(chatId);
  const blockMutation = useBlockChat(chatId);
  const unblockMutation = useUnblockChat(chatId);
  const closeMutation = useCloseChat(chatId);
  const isBusy = useAnyPending([releaseMutation, blockMutation, unblockMutation, closeMutation]);

  const menu = useMessageContextMenu({ chatId });

  const myUserId = me.data?.id ?? null;
  const orgSlot = useMemo(
    () => findOrgSlot(detail.data?.participants, organizationId),
    [detail.data, organizationId],
  );
  const myParticipantId = useMemo(
    () => getMyParticipantId(orgSlot, myUserId),
    [orgSlot, myUserId],
  );
  const title = useMemo(
    () => formatChatTitle(detail.data?.participants),
    [detail.data],
  );
  const subtitle = useMemo(
    () => formatChatSubtitle(detail.data?.contextItemId),
    [detail.data?.contextItemId],
  );
  const flatMessages = useMemo(
    () => flattenMessagePages(messages.data?.pages),
    [messages.data],
  );

  const status: ChatStatus = detail.data?.status ?? 'open';
  const isMyClaim = orgSlot?.assignedUserId === myUserId;
  const needsClaim = orgSlot?.assignedUserId === null;
  const composerDisabled = status === 'closed';
  const isLoading = detail.isLoading || messages.isLoading;

  if (isLoading) {
    return <EmployeeChatLoading />;
  }

  return (
    <EmployeeChatLayout
      header={
        <EmployeeChatHeader
          title={title}
          subtitle={subtitle}
          backButton={onBack ? <EmployeeChatBackButton onPress={onBack} /> : null}
        />
      }
      actions={
        <EmployeeActionsBar
          status={status}
          isMyClaim={isMyClaim}
          onRelease={() => myParticipantId && releaseMutation.mutate(myParticipantId)}
          onBlock={() => blockMutation.mutate(null)}
          onUnblock={() => unblockMutation.mutate()}
          onClose={() => closeMutation.mutate(null)}
          isBusy={isBusy}
        />
      }
      messages={
        <MessageList
          messages={flatMessages}
          myParticipantId={myParticipantId}
          hasMore={messages.hasNextPage ?? false}
          isLoadingMore={messages.isFetchingNextPage}
          onLoadMore={() => messages.fetchNextPage()}
          onReachStart={markRead}
          onLongPressMessage={menu.onLongPress}
        />
      }
      composer={
        <EmployeeChatComposer
          needsClaim={needsClaim}
          disabled={composerDisabled}
          isSending={sendMutation.isPending}
          onSend={({ text, mediaIds, claim }) =>
            sendMutation.mutate({
              chatId,
              body: { text: text.length > 0 ? text : null, mediaIds },
              claim,
            })
          }
        />
      }
      modal={
        <EditMessageModal
          visible={menu.isEditingOpen}
          initialText={menu.editingText}
          isSaving={menu.isEditSaving}
          onCancel={menu.onEditCancel}
          onSave={menu.onEditSave}
        />
      }
    />
  );
}
