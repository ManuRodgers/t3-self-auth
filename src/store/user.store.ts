import type { User } from "@/types/user";
import create from "zustand";
import { myMiddlewares } from "./middlewares";
import type { ZustandHookSelectors } from "auto-zustand-selectors-hook";
import { createSelectorHooks } from "auto-zustand-selectors-hook";

export type UserState = {
  authUser: User | null;
  uploadingImage: boolean;
  pageLoading: boolean;
};
export type UserAction = {
  setAuthUser: (user: User) => void;
  setUploadingImage: (isUploadingImage: boolean) => void;
  setPageLoading: (isPageLoading: boolean) => void;
};

const useUserStoreBase = create<UserState & UserAction>()(
  myMiddlewares<UserState, UserAction>((set) => ({
    authUser: null,
    uploadingImage: false,
    pageLoading: false,
    setAuthUser: (user) =>
      set((state) => {
        state.authUser = user;
      }),
    setUploadingImage: (isUploadingImage) =>
      set((state) => {
        state.uploadingImage = isUploadingImage;
      }),
    setPageLoading: (isPageLoading) =>
      set((state) => {
        state.pageLoading = isPageLoading;
      }),
  }))
);

export const useUserStore = createSelectorHooks(
  useUserStoreBase
) as typeof useUserStoreBase & ZustandHookSelectors<UserState & UserAction>;
