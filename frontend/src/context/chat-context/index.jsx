import { createContext, useContext, useState, useEffect } from "react";
import { sendMessageApi, fetchMessagesApi } from "@/services/index";

export const ChatContext = createContext();

// Helper to generate cache key for storing messages per conversation
const getChatCacheKey = (courseId, otherUserId) =>
  `chat_${courseId}_${otherUserId}`;

// Helper to save messages to localStorage
const saveChatToStorage = (courseId, otherUserId, messages) => {
  try {
    const key = getChatCacheKey(courseId, otherUserId);
    localStorage.setItem(key, JSON.stringify(messages));
  } catch (err) {
    console.warn("Failed to save chat to localStorage:", err);
  }
};

// Helper to load messages from localStorage
const loadChatFromStorage = (courseId, otherUserId) => {
  try {
    const key = getChatCacheKey(courseId, otherUserId);
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
  } catch (err) {
    console.warn("Failed to load chat from localStorage:", err);
    return null;
  }
};

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ message: "" });
  const [currentChatKey, setCurrentChatKey] = useState(null);

  // 🔹 input change
  const handleChange = (e) => {
    setFormData({ message: e.target.value });
  };

  // 🔹 fetch old messages
  const fetchMessages = async (courseId, otherUserId) => {
    try {
      setLoading(true);
      const chatKey = getChatCacheKey(courseId, otherUserId);
      setCurrentChatKey(chatKey);

      // Try to load from localStorage first
      const cachedMessages = loadChatFromStorage(courseId, otherUserId);
      if (cachedMessages && cachedMessages.length > 0) {
        setMessages(cachedMessages);
      }

      // Fetch fresh messages from server
      const res = await fetchMessagesApi(courseId, otherUserId);
      if (res?.data?.data) {
        setMessages(res.data.data);
        // Save to localStorage after fetching
        saveChatToStorage(courseId, otherUserId, res.data.data);
      }
    } catch (err) {
      console.error("Fetch messages error:", err);
      // If server fetch fails, keep cached messages
      const cachedMessages = loadChatFromStorage(courseId, otherUserId);
      if (cachedMessages) {
        setMessages(cachedMessages);
      }
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

      console.log("📨 API Response:", res);

      // res = { replyType: 'ai'|'teacher', message: <ChatMessage object> }
      // Always append the returned message object (student's message or AI's message)
      if (res?.message) {
        setMessages((prev) => {
          const base = Array.isArray(prev) ? prev : [];
          const updated = [...base, res.message];
          // Save updated messages to localStorage
          saveChatToStorage(courseId, receiverId, updated);
          return updated;
        });
      } else {
        console.warn("⚠️  No message in response:", res);
      }

      setFormData({ message: "" });
    } catch (err) {
      console.error("❌ Send Message Error:", err);
      // Show error message to user
      const errorMsg = {
        _id: Date.now().toString(),
        message: `Error: ${err.response?.data?.message || err.message || "Failed to send message"}`,
        senderRole: "system",
        createdAt: new Date(),
      };
      setMessages((prev) => {
        const base = Array.isArray(prev) ? prev : [];
        return [...base, errorMsg];
      });
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

// Keep a default export for existing imports while also providing a stable
// named export (`ChatProvider`) to satisfy Vite's Fast Refresh expectations.
export default ChatProvider;
