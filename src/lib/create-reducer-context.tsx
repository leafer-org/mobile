import { createContext, useCallback, useContext, useState } from 'react';

export const createReducerContext = <S, A, I = undefined>(
  init: (i: I) => S,
  reducer: (prevState: S, arg: A) => S,
) => {
  const StateContext = createContext<S | undefined>(undefined);
  const ActionContext = createContext<((action: A) => void) | undefined>(undefined);

  const Provider = (
    props: { children: React.ReactNode } & (I extends undefined ? {} : { initialArg: I }),
  ) => {
    // biome-ignore lint/suspicious/noExplicitAny: simple solution
    const initialArg = (props as any)?.initialArg;

    const [state, setState] = useState(() => init(initialArg as never));

    // biome-ignore lint/correctness/useExhaustiveDependencies: infarstructure code
    const dispatch = useCallback(
      (action: A) => {
        setState((prevState) => reducer(prevState, action));
      },
      [reducer],
    );

    console.log('state', state);

    return (
      <StateContext.Provider value={state}>
        <ActionContext.Provider value={dispatch}>{props.children}</ActionContext.Provider>
      </StateContext.Provider>
    );
  };

  const useStateData = () => {
    const state = useContext(StateContext);
    if (!state) {
      throw new Error('useState must be used within a Provider');
    }
    return state;
  };
  const useDispatch = () => {
    const dispatch = useContext(ActionContext);
    if (!dispatch) {
      throw new Error('useAction must be used within a Provider');
    }
    return dispatch;
  };

  return {
    Provider,
    useState: useStateData,
    useDispatch,
  };
};
