import type { ChatMessage } from '@/support/chat';

export function flattenMessagePages(
  pages: { messages: ChatMessage[] }[] | undefined,
): ChatMessage[] {
  return pages?.flatMap((p) => p.messages) ?? [];
}
