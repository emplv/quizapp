import create, { State } from "zustand";
import { persist } from "zustand/middleware";

import { ICredentials, IUser } from "../interfaces/IUser";
import { ApiService, setAuthHeader } from "../services/ApiService";

export interface IAuth extends State {
  user: IUser | null;
  token: string | null;
  setData(data: Partial<IAuth>): void;
  login(credentials: ICredentials): Promise<void | string | unknown>;
  register(credentials: ICredentials): Promise<void | string | unknown>;
  logout(): void;
}

export const useAuth = create(
  persist<IAuth>(
    (set, get) => ({
      user: null,
      token: null,
      setData: (data) => set(data),
      login: async (credentials) => {
        try {
          const response = await ApiService.auth(credentials);
          if (response.data) {
            const { user, accessToken } = response.data;
            set({ user, token: accessToken });
            setAuthHeader(accessToken);
          }
        } catch (err) {
          console.warn(err);
          throw err;
        }
      },
      register: async (credentials) => {
        try {
          const response = await ApiService.register(credentials);
          if (response.data.id) {
            await get().login({
              email: credentials.email,
              password: credentials.password,
            });
          }
        } catch (err) {
          console.warn(err);
          throw err;
        }
      },
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "user-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      onRehydrateStorage: (state) => async (state, error) => {
        if (!error && state?.token && state.user?._id) {
          try {
            setAuthHeader(state.token);
            const response = await ApiService.getUserById(state.user._id);
            state.setData({
              user: response.data,
            });
          } catch (err) {
            state.setData({
              user: null,
              token: null,
            });
          }
        }
      },
    },
  ),
);
