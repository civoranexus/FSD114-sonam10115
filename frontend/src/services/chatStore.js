import { create } from "zustand";
import axiosInstance from "@/api/axiosInstance";
import toast from "react-hot-toast";
import { useSocketStore } from "./socketStore";

export const useChatStore = create((set, get) => ({
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    setActiveTab: (tab) => set({ activeTab: tab }),
    setSelectedUser: (selectedUser) => set({ selectedUser }),

    getAllContacts: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/contacts");
            set({ allContacts: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },
    getChatPartners: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/chats");
            set({ chats: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessagesByUserId: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        const authUser = useSocketStore.getState().authUser;

        if (!authUser || !selectedUser) return;

        const tempId = `temp-${Date.now()}`;

        const optimisticMessage = {
            _id: tempId,
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            isOptimistic: true, // flag to identify optimistic messages (optional)
        };
        // ✅ optimistic UI update
        set({ messages: [...messages, optimisticMessage] });

        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set((state) => ({
                messages: state.messages
                    .filter((m) => m._id !== tempId)
                    .concat(res.data),
            }));
        } catch (error) {
            //optimistic message
            set((state) => ({
                messages: state.messages.filter((m) => m._id !== tempId),
            }));
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useSocketStore.getState().socket;
        if (!socket) return;
        socket.off("newMessage"); // Unsubscribe from previous listeners to prevent duplicates


        socket.on("newMessage", (newMessage) => {
            if (newMessage.senderId !== selectedUser._id) return;


            set((state) => ({
                messages: [...state.messages, newMessage],
            }));
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useSocketStore.getState().socket;
        if (socket) socket.off("newMessage");
    },
}));
