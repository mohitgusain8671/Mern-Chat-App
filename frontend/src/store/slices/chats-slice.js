
export const createChatSlice = (set,get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    dmContacts: [],
    isUploading: false,
    isDownloading: false,
    fileUploadProgress: 0,
    fileDownloadProgress: 0,
    channels: [],
    setChannels: (channels) => set({ channels }),
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
                    recipient: selectedChatType === 'channel' ? message.recipient : message.recipient._id,
                    sender: selectedChatType === 'channel' ? message.sender : message.sender._id,
                }
            ]
        })
    },

    addChannel: (channel) => {
        const channels = get().channels;
        set({ channels: [channel, ...channels ] });
    },
    addChannelInChannelList: (message) => {
        const channels = get().channels;
        const data = channels.find(channel => channel._id === message.channelId);
        const index = channels.findIndex(channel => channel._id === message.channelId);
        if(index !== -1 && index !== undefined) {
            channels.splice(index,1);
            channels.unshift(data);
        }
        set({channels: channels})
    },

    addContactInDMContacts : (message) => {
        const userId = get().userInfo._id;
        const dmContacts = get().dmContacts;
        const fromId = message.sender._id === userId ? message.recipient._id : message.sender._id;
        const fromData = message.sender._id === userId ? message.recipient : message.sender;
        const data = dmContacts.find(contact => contact._id === fromId);
        const index = dmContacts.findIndex(contact => contact._id === fromId);
        if(index !== -1 && index !== undefined) {
            dmContacts.splice(index,1);
            dmContacts.unshift(data);
        } else {
            dmContacts.unshift(fromData);
        }
        set({ dmContacts: dmContacts });
    },
    removeContactinDMContacts: (contact) => {
        const contactId = contact._id;
        const dmContacts = get().dmContacts;
        const index = dmContacts.findIndex(item => item._id === contactId);
        if(index !== -1 && index !== undefined) {
            dmContacts.splice(index, 1);
        }
        set({ dmContacts: dmContacts });
    },
    removeChannelInChannelList: (channel) => {
        const channelId = channel._id;
        const channels = get().channels;
        const index = channels.findIndex(item => item._id === channelId);
        if(index !== -1 && index !== undefined) {
            channels.splice(index, 1);
        }
        set({ channels: channels });
    },
    UpdateChannelInfo: (channel)=>{
        const channelId = channel._id;
        const channels = get().channels;
        const index = channels.findIndex(item =>
            item._id === channelId
        );
        if(index !== -1 && index !== undefined) {
            channels[index] = channel;
        }
        set({ channels: channels });
    }
})