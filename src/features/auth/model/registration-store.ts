import { createReducerContext } from '@/lib/create-reducer-context';

type RegistrationState = {
  registrationSessionId?: string;
  cityId?: string;
  lat?: number;
  lng?: number;
};

type RegistrationAction =
  | { type: 'otpVerified'; registrationSessionId: string }
  | { type: 'citySelected'; cityId: string; lat?: number; lng?: number };

const registrationStore = createReducerContext<RegistrationState, RegistrationAction>(
  () => ({}),
  (state, action) => {
    switch (action.type) {
      case 'otpVerified':
        return { ...state, registrationSessionId: action.registrationSessionId };
      case 'citySelected':
        return { ...state, cityId: action.cityId, lat: action.lat, lng: action.lng };
      default:
        return state;
    }
  },
);

export const RegistrationStoreProvider = registrationStore.Provider;
export const useRegistrationState = registrationStore.useState;
export const useRegistrationDispatch = registrationStore.useDispatch;
