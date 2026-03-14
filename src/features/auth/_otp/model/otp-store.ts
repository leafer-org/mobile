import { createReducerContext } from '@/lib/create-reducer-context';

type OtpState = {
  sentAt?: number;
  retryAfterSec?: number;
};

type OtpAction =
  | {
      type: 'phoneSent';
      nextRetrySec: number;
    }
  | {
      type: 'phoneRequestFailed';
      retryAfterSec?: number;
    };

export const otpStore = createReducerContext<OtpState, OtpAction>(
  () => ({
    sentAt: undefined,
    retryAfterSec: undefined,
  }),
  (state, action) => {
    switch (action.type) {
      case 'phoneSent':
        return {
          ...state,
          sentAt: Date.now(),
          retryAfterSec: action.nextRetrySec,
        };

      case 'phoneRequestFailed':
        return {
          ...state,
          sentAt: action.retryAfterSec ? Date.now() : undefined,
          retryAfterSec: action.retryAfterSec,
        };

      default:
        return state;
    }
  },
);

export const OtpStoreProvider = otpStore.Provider;
