import { create } from "zustand";
import { createAuthSlice } from "./slices/auth-slice";
import { createChatSlice } from "./slices/chats-slice";

export const useAppStore = create()((...a)=>({
    ...createAuthSlice(...a),
    ...createChatSlice(...a)
}));