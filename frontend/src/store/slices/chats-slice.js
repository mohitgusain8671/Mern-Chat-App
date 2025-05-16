export const createChatSlice = (set,get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    setSelectedChatType: (chatType) => set({ selectedChatType: chatType }),
    setSelectedChatData: (chatData) => set({ selectedChatData: chatData }),
    setSelectedChatMessages: (messages) => set({ selectedChatMessages: messages }),
    closeChat: () => set({ selectedChatType: undefined, selectedChatData: undefined, selectedChatMessages: [] }),
    getSelectedChatType: () => get().selectedChatType,
    getSelectedChatData: () => get().selectedChatData,
})