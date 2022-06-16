import create from 'zustand'

interface TokenState {
	access_token?: string,
	setAccessToken: (access_token: string) => void,
}

export const useStore = create<TokenState>((set) => ({
	access_token: undefined,
	setAccessToken: (access_token) => set({
		access_token,
	})
}))
