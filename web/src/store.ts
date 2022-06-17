import create, { EqualityChecker, State, StateSelector } from "zustand";
import createContext from "zustand/context";
import type { StoreApi } from "zustand";

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
