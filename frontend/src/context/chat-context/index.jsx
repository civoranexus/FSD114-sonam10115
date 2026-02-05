import { createContext, useContext, useState, useEffect, useRef } from "react";
import { sendMessageApi, fetchMessagesApi } from "@/services/index";
import io from "socket.io-client";

export const ChatContext = createContext();

// WebSocket connection instance (singleton)
let socket = null;

const getSocketInstance = (token) => {
  if (!socket) {
    socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:8000", {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("✅ WebSocket connected:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ WebSocket connection error:", error);
    });

    socket.on("disconnect", () => {
      console.log("❌ WebSocket disconnected");
    });
  }
  return socket;
};

// Helper to decode JWT and get user ID
const getUserIdFromToken = (token) => {
  try {
    // JWT format: header.payload.signature
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded._id || decoded.id || null;
  } catch (err) {
    console.error("Failed to decode token:", err);
    return null;
  }
};

// Helper to generate cache key
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
  const [typing, setTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [userId, setUserId] = useState(null);
  const currentChatRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // ============ INITIALIZE WEBSOCKET ============
  useEffect(() => {
    // Get token from sessionStorage
    const token = sessionStorage.getItem("accessToken");
    if (!token) return;

    // Extract user ID from token
    const uid = getUserIdFromToken(token);
    if (uid) {
      setUserId(uid);
    }

    try {
      const ws = getSocketInstance(token);
      socketRef.current = ws;

      // Join user room
      console.log(
        "➡️ Emitting user:join with token (truncated):",
        token?.slice?.(0, 10) + "...",
      );
      ws.emit("user:join", { token });

      // Debug: confirm handlers registration
      console.log(
        "🔧 Registering socket handlers for message/typing/status events",
      );

      // Listen for incoming messages
      ws.on("message:receive", (data) => {
        console.log("📨 Message received:", data);
        setMessages((prev) => {
          const updated = [...prev, data];
          if (currentChatRef.current) {
            saveChatToStorage(
              currentChatRef.current.courseId,
              currentChatRef.current.otherUserId,
              updated,
            );
          }
          return updated;
        });
      });

      // Listen for typing indicators
      ws.on("typing:indicator", (data) => {
        console.log("⌨️  Typing indicator:", data);
        setTyping(data.isTyping);
      });

      // Listen for online status
      ws.on("user:online", (data) => {
        console.log("🟢 User online event:", data.userId);
        setOnlineUsers((prev) => new Set([...prev, data.userId]));
      });

      ws.on("user:offline", (data) => {
        console.log("🔴 User offline event:", data.userId);
        setOnlineUsers((prev) => {
          const updated = new Set(prev);
          updated.delete(data.userId);
          return updated;
        });
      });

      // Listen for errors
      ws.on("error", (data) => {
        console.error("❌ Socket error:", data);
      });

      return () => {
        // Cleanup on unmount
        ws.off("message:receive");
        ws.off("typing:indicator");
        ws.off("user:online");
        ws.off("user:offline");
        ws.off("error");
      };
    } catch (error) {
      console.error("❌ WebSocket initialization error:", error);
    }
  }, []);

  // ============ INPUT CHANGE ============
  const handleChange = (e) => {
    const { value } = e.target;
    setFormData({ message: value });

    // Emit typing indicator
    if (currentChatRef.current && socketRef.current) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      socketRef.current.emit("typing:start", {
        userId: userId,
        receiverId: currentChatRef.current.otherUserId,
        courseId: currentChatRef.current.courseId,
      });

      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current.emit("typing:stop", {
          userId: userId,
          receiverId: currentChatRef.current.otherUserId,
          courseId: currentChatRef.current.courseId,
        });
      }, 1000);
    }
  };

  // ============ FETCH OLD MESSAGES ============
  const fetchMessages = async (courseId, otherUserId) => {
    // Basic validation: Mongo ObjectId is 24 hex chars
    const isObjectId = (id) =>
      typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);

    if (!isObjectId(courseId) || !isObjectId(otherUserId)) {
      console.warn("⚠️ Invalid chat params, aborting fetchMessages:", {
        courseId,
        otherUserId,
      });
      // Try to load cached messages if any
      const cachedMessages = loadChatFromStorage(courseId, otherUserId);
      if (cachedMessages) setMessages(cachedMessages);
      return;
    }

    try {
      setLoading(true);
      currentChatRef.current = { courseId, otherUserId };

      // Try to load from localStorage first
      const cachedMessages = loadChatFromStorage(courseId, otherUserId);
      if (cachedMessages && cachedMessages.length > 0) {
        setMessages(cachedMessages);
      }

      // Fetch fresh messages from server
      const res = await fetchMessagesApi(courseId, otherUserId);
      if (res?.data?.data) {
        setMessages(res.data.data);
        saveChatToStorage(courseId, otherUserId, res.data.data);
      }

      // Check online status
      if (socketRef.current) {
        socketRef.current.emit("status:check", { userIds: [otherUserId] });
      }
    } catch (err) {
      console.error("❌ Fetch messages error:", err);
      const cachedMessages = loadChatFromStorage(courseId, otherUserId);
      if (cachedMessages) {
        setMessages(cachedMessages);
      }
    } finally {
      setLoading(false);
    }
  };

  // ============ SEND MESSAGE ============
  const sendMessage = async (receiverId, courseId) => {
    if (!formData.message.trim()) return;

    // Basic validation: Mongo ObjectId is 24 hex chars
    const isObjectId = (id) =>
      typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);

    if (!isObjectId(receiverId) || !isObjectId(courseId)) {
      const errMsg = `Invalid chat params: courseId=${courseId} receiverId=${receiverId}`;
      console.warn("⚠️", errMsg);
      const errorMsg = {
        _id: Date.now().toString(),
        message: `Error: ${errMsg}`,
        senderRole: "system",
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const message = formData.message;

      // Emit via WebSocket only when socket is connected
      const sock = socketRef.current;
      console.log("🔁 sendMessage - socket status:", {
        socketId: sock?.id,
        connected: !!sock?.connected,
      });

      if (sock && sock.connected) {
        console.log("➡️ emitting message:send via WebSocket", {
          receiverId,
          courseId,
        });
        sock.emit("message:send", {
          senderId: userId,
          receiverId,
          courseId,
          message,
        });

        // Stop typing indicator
        sock.emit("typing:stop", {
          userId: userId,
          receiverId,
          courseId,
        });
      } else {
        // Fallback to REST API if WebSocket is unavailable or disconnected
        console.warn("⚠️  WebSocket not connected, using REST API");
        const res = await sendMessageApi({
          receiverId,
          courseId,
          message,
        });

        if (res?.message) {
          setMessages((prev) => {
            const updated = [...prev, res.message];
            saveChatToStorage(courseId, receiverId, updated);
            return updated;
          });
        }
      }

      setFormData({ message: "" });
    } catch (err) {
      console.error("❌ Send message error:", err);
      const errorMsg = {
        _id: Date.now().toString(),
        message: `Error: ${err.response?.data?.message || err.message || "Failed to send message"}`,
        senderRole: "system",
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
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
        typing,
        onlineUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
};

export default ChatProvider;
