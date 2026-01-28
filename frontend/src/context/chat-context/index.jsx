import { createContext, useContext, useState } from "react";
import { initialChatMessageData } from "@/config";
import { sendMessageApi, fetchMessagesApi } from "@/services/index";

export const ChatContext = createContext();

export default function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [formData, setFormData] = useState(initialChatMessageData);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const sendMessage = async (receiverId, courseId) => {
    try {
      setLoading(true);

      const res = await sendMessageApi({
        receiverId,
        courseId,
        message: formData.message,
      });

      setMessages((prev) => [...prev, res.data.data]);
      setFormData(initialChatMessageData);
    } catch (error) {
      console.error("Send message error", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (courseId, userId) => {
    try {
      setLoading(true);
      const res = await fetchMessagesApi(courseId, userId);
      setMessages(res.data.data);
    } catch (error) {
      console.error("Fetch messages error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        formData,
        loading,
        handleChange,
        sendMessage,
        fetchMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  return useContext(ChatContext);
};
