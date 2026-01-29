import { useEffect } from "react";
import { useChat } from "@/context/chat-context";
import { useParams } from "react-router-dom";

const Chat = () => {
  const { courseId, otherUserId } = useParams();

  const {
    messages,
    formData,
    handleChange,
    sendMessage,
    fetchMessages,
    loading,
  } = useChat();

  console.log("Chat Params:", courseId, otherUserId);

  useEffect(() => {
    if (courseId && otherUserId) {
      fetchMessages(courseId, otherUserId);
    }
  }, [courseId, otherUserId]);

  return (
    <div>
      <h2>Chat</h2>

      <div style={{ minHeight: "300px", border: "1px solid #ccc" }}>
        {messages?.map((msg) => (
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
