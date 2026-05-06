import { useCallback, useMemo, useSyncExternalStore } from 'react';

import type { PublicApiComponents } from '@/kernel/api';
import { ContactLinkType } from '@/kernel/api/schema';

type ContactLinkSchema = PublicApiComponents['schemas']['ContactLink'];
type TeamMemberSchema = PublicApiComponents['schemas']['TeamMember'];

let nextLocalId = 1;
const localId = () => `loc${nextLocalId++}`;

export type ContactLink = ContactLinkSchema & { _localId: string };
export type TeamMember = TeamMemberSchema & { _localId: string };
export type Team = { title: string; members: TeamMember[] };

export type EditInfoFormState = {
  name: string;
  description: string;
  avatarId: string | null;
  contacts: ContactLink[];
  team: Team;
};

export type InfoDraftSnapshot = {
  name: string;
  description: string;
  avatarId?: string | null;
  contacts?: ContactLinkSchema[];
  team?: { title?: string; members?: TeamMemberSchema[] };
};

export function infoDraftToFormState(draft: InfoDraftSnapshot): EditInfoFormState {
  return {
    name: draft.name,
    description: draft.description,
    avatarId: draft.avatarId ?? null,
    contacts: (draft.contacts ?? []).map((c) => ({ ...c, _localId: localId() })),
    team: {
      title: draft.team?.title ?? '',
      members: (draft.team?.members ?? []).map((m) => ({ ...m, _localId: localId() })),
    },
  };
}

export function stripLocalIds(state: EditInfoFormState): {
  contacts: ContactLinkSchema[];
  team: { title: string; members: TeamMemberSchema[] };
} {
  return {
    contacts: state.contacts.map(({ _localId: _id, ...c }) => c),
    team: {
      title: state.team.title,
      members: state.team.members.map(({ _localId: _id, ...m }) => m),
    },
  };
}

type Store = {
  state: EditInfoFormState;
  subscribers: Set<() => void>;
};

const stores = new Map<string, Store>();

function getOrCreateStore(orgId: string, initial?: EditInfoFormState): Store {
  let store = stores.get(orgId);
  if (!store) {
    if (!initial) {
      throw new Error(
        `useEditInfoForm: store for orgId=${orgId} not initialized — pass initial state in the entry-point route`,
      );
    }
    store = { state: initial, subscribers: new Set() };
    stores.set(orgId, store);
  }
  return store;
}

function notify(store: Store) {
  for (const cb of store.subscribers) cb();
}

function update(store: Store, patch: Partial<EditInfoFormState>) {
  store.state = { ...store.state, ...patch };
  notify(store);
}

export function clearEditInfoForm(orgId: string): void {
  stores.delete(orgId);
}

export type EditInfoFormApi = {
  state: EditInfoFormState;
  setName: (v: string) => void;
  setDescription: (v: string) => void;
  setAvatarId: (v: string | null) => void;
  setContacts: (v: ContactLink[]) => void;
  addContact: () => void;
  setTeamTitle: (v: string) => void;
  setTeamMember: (index: number, v: TeamMember) => void;
  addTeamMember: () => number;
  removeTeamMember: (index: number) => void;
  isValid: boolean;
};

export function useEditInfoForm(orgId: string, initial?: EditInfoFormState): EditInfoFormApi {
  // biome-ignore lint/correctness/useExhaustiveDependencies: initial is only used on first store creation; subsequent renders reuse the existing store keyed by orgId
  const store = useMemo(() => getOrCreateStore(orgId, initial), [orgId]);

  const subscribe = useCallback(
    (cb: () => void) => {
      store.subscribers.add(cb);
      return () => {
        store.subscribers.delete(cb);
      };
    },
    [store],
  );

  const getSnapshot = useCallback(() => store.state, [store]);
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return useMemo<EditInfoFormApi>(
    () => ({
      state,
      setName: (v) => update(store, { name: v }),
      setDescription: (v) => update(store, { description: v }),
      setAvatarId: (v) => update(store, { avatarId: v }),
      setContacts: (v) => update(store, { contacts: v }),
      addContact: () =>
        update(store, {
          contacts: [
            ...store.state.contacts,
            { _localId: localId(), type: ContactLinkType.phone, value: '' },
          ],
        }),
      setTeamTitle: (v) => update(store, { team: { ...store.state.team, title: v } }),
      setTeamMember: (index, member) => {
        const members = store.state.team.members.slice();
        members[index] = member;
        update(store, { team: { ...store.state.team, members } });
      },
      addTeamMember: () => {
        const members = store.state.team.members;
        const newIndex = members.length;
        update(store, {
          team: {
            ...store.state.team,
            members: [...members, { _localId: localId(), name: '', description: '', media: [] }],
          },
        });
        return newIndex;
      },
      removeTeamMember: (index) => {
        update(store, {
          team: {
            ...store.state.team,
            members: store.state.team.members.filter((_, i) => i !== index),
          },
        });
      },
      isValid: state.name.trim().length > 0,
    }),
    [store, state],
  );
}
