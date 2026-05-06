export const chatQueryKeys = {
  all: ['chat'] as const,
  myChats: () => [...chatQueryKeys.all, 'my-list'] as const,
  adminChats: (filters: Record<string, unknown>) =>
    [...chatQueryKeys.all, 'admin-list', filters] as const,
  detail: (chatId: string) => [...chatQueryKeys.all, 'detail', chatId] as const,
  messages: (chatId: string) => [...chatQueryKeys.all, 'messages', chatId] as const,
  unreadSummary: () => [...chatQueryKeys.all, 'unread-summary'] as const,
};
