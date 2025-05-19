export const createChatSlice = (set,get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    dmContacts: [],
    isUploading: false,
    isDownloading: false,
    fileUploadProgress: 0,
    fileDownloadProgress: 0,
    setIsUploading: (isUploading) => set({isUploading}),
    setIsDownloading: (isDownloading) => set({isDownloading}),
    setFileUploadProgress: (fileUploadProgress) => set({fileUploadProgress}),
    setFileDownloadProgress: (fileDownloadProgress) => set({fileDownloadProgress}),
    setDMContacts: (contacts) => set({ dmContacts: contacts }),
    setSelectedChatType: (chatType) => set({ selectedChatType: chatType }),
    setSelectedChatData: (chatData) => set({ selectedChatData: chatData }),
    setSelectedChatMessages: (messages) => set({ selectedChatMessages: messages }),
    closeChat: () => set({ selectedChatType: undefined, selectedChatData: undefined, selectedChatMessages: [] }),
    getSelectedChatType: () => get().selectedChatType,
    getSelectedChatData: () => get().selectedChatData,
    addMessage: (message) => {
        const selectedChatMessages = get().selectedChatMessages;
        const selectedChatType = get().selectedChatType;

        set({
            selectedChatMessages: [
                ...selectedChatMessages,{
                    ...message,
                    recipient: selectedChatType === 'group' ? message.recipient : message.recipient._id,
                    sender: selectedChatType === 'group' ? message.sender : message.sender._id,
                }
            ]
        })
    }
})