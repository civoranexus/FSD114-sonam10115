import { createContext, useContext, useState } from "react";
import { sendMessageApi, fetchMessagesApi } from "@/services/index";

export const ChatContext = createContext();

export default function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ message: "" });

  // 🔹 input change
  const handleChange = (e) => {
    setFormData({ message: e.target.value });
  };

  // 🔹 fetch old messages
  const fetchMessages = async (courseId, otherUserId) => {
    try {
      setLoading(true);
      const res = await fetchMessagesApi(courseId, otherUserId);
      setMessages(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 send message
  const sendMessage = async (receiverId, courseId) => {
    if (!formData.message.trim()) return;

    try {
      setLoading(true);

      const res = await sendMessageApi({
        receiverId,
        courseId,
        message: formData.message,
      });

      setMessages((prev) => [...prev, res.data.message]);
      setFormData({ message: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        formData,
        handleChange,
        sendMessage,
        fetchMessages,
        loading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
