import create, { EqualityChecker, State, StateSelector } from "zustand";
import createContext from "zustand/context";
import type { StoreApi } from "zustand";
import {useLayoutEffect} from "react";

export let store

declare type ExtractState<S> = S extends {
  getState: () => infer T;
}
  ? T
  : never;

declare type UseContextStore<S extends StoreApi<State>> = {
  (): ExtractState<S>;
  <U>(
    selector: StateSelector<ExtractState<S>, U>,
    equalityFn?: EqualityChecker<U>
  ): U;
};

export interface TokenState {
  access_token?: string;
  setAccessToken: (access_token: string) => void;
}

const initialState: Partial<TokenState> = {
  access_token: undefined,
};

const zustandContext = createContext();
export const Provider = zustandContext.Provider;
export const useStore = zustandContext.useStore as UseContextStore<
  StoreApi<TokenState>
>;

export const initializeStore = (preloadedState?: string) => {
  const state = preloadedState
    ? (JSON.parse(preloadedState) as Partial<TokenState>)
    : undefined;

  return create<TokenState>((set) => ({
    ...initialState,
    ...state,
    setAccessToken: (access_token) => {
      set({
        access_token,
      });
    },
  }));
};

export function useCreateStore(serverInitialState?: string) {
  // Server side code: For SSR & SSG, always use a new store.
  if (typeof window === 'undefined') {
    return () => initializeStore(serverInitialState)
  }
  // End of server side code

  // Client side code:
  // Next.js always re-uses same store regardless of whether page is a SSR or SSG or CSR type.
  const isReusingStore = Boolean(store)
  store = store ?? initializeStore(serverInitialState)
  // When next.js re-renders _app while re-using an older store, then replace current state with
  // the new state (in the next render cycle).
  // (Why next render cycle? Because react cannot re-render while a render is already in progress.
  // i.e. we cannot do a setState() as that will initiate a re-render)
  //
  // eslint complaining "React Hooks must be called in the exact same order in every component render"
  // is ignorable as this code runs in same order in a given environment (i.e. client or server)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useLayoutEffect(() => {
    // serverInitialState is undefined for CSR pages. It is up to you if you want to reset
    // states on CSR page navigation or not. I have chosen not to, but if you choose to,
    // then add `serverInitialState = getDefaultInitialState()` here.
    if (serverInitialState && isReusingStore) {
      const state = serverInitialState
          ? (JSON.parse(serverInitialState) as Partial<TokenState>)
          : undefined;

      store.setState(
          {
            // re-use functions from existing store
            ...store.getState(),
            // but reset all other properties.
            ...state,
          },
          true // replace states, rather than shallow merging
      )
    }
  })

  return () => store
}
