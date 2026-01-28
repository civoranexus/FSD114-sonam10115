import { useEffect } from "react";
import { useChat } from "@/context/chat-context/index";

const Chat = ({ courseId, otherUserId }) => {
  const {
    messages,
    formData,
    handleChange,
    sendMessage,
    fetchMessages,
    loading,
  } = useChat();

  useEffect(() => {
    fetchMessages(courseId, otherUserId);
  }, [courseId, otherUserId]);

  return (
    <div>
      <h2>Chat</h2>

      <div style={{ minHeight: "300px" }}>
        {messages.map((msg) => (
          <p key={msg._id}>
            <b>{msg.sender}</b>: {msg.message}
          </p>
        ))}
      </div>

      <input
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Type your message..."
      />

      <button
        onClick={() => sendMessage(otherUserId, courseId)}
        disabled={loading}
      >
        Send
      </button>
    </div>
  );
};

export default Chat;
