import { useState } from 'react';

import type { InboxTab } from '../domain/inbox-tab';

export function useInboxTabs(initial: InboxTab = 'all') {
  const [tab, setTab] = useState<InboxTab>(initial);
  return { tab, setTab };
}
