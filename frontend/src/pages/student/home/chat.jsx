import { useEffect, useRef } from "react";
import { useChat } from "@/context/chat-context";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

const Chat = () => {
  const { courseId, otherUserId } = useParams();
  const messagesEndRef = useRef(null);

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

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Determine message styling based on role
  const getMessageStyle = (senderRole) => {
    const baseStyle =
      "px-4 py-3 rounded-lg max-w-xs lg:max-w-md xl:max-w-lg break-words";
    switch (senderRole) {
      case "student":
        return `${baseStyle} bg-blue-500 text-white rounded-br-none`;
      case "teacher":
        return `${baseStyle} bg-green-500 text-white rounded-bl-none`;
      case "ai":
        return `${baseStyle} bg-purple-500 text-white rounded-bl-none italic`;
      case "system":
        return `${baseStyle} bg-red-400 text-white rounded-bl-none font-semibold`;
      default:
        return `${baseStyle} bg-gray-300 text-gray-800 rounded-bl-none`;
    }
  };

  const getRoleBadge = (senderRole) => {
    const badges = {
      student: (
        <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded">
          Student
        </span>
      ),
      teacher: (
        <span className="inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded">
          Teacher
        </span>
      ),
      ai: (
        <span className="inline-block px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-700 rounded">
          🤖 AI Assistant
        </span>
      ),
      system: (
        <span className="inline-block px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded">
          ⚠️ System
        </span>
      ),
    };
    return badges[senderRole] || null;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm p-4">
        <h2 className="text-2xl font-bold text-gray-800">💬 Chat</h2>
        <p className="text-sm text-gray-500">
          Course: {courseId?.substring(0, 8)}...
        </p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages && messages.length > 0 ? (
          messages.map((msg) => {
            const isAI = msg.senderRole === "ai";
            const isStudent = msg.senderRole === "student";

            return (
              <div
                key={msg._id}
                className={`flex ${
                  isStudent ? "justify-end" : "justify-start"
                } animate-fadeIn`}
              >
                <div className="flex flex-col gap-1 max-w-lg">
                  {/* Sender Info */}
                  <div
                    className={`flex items-center gap-2 px-2 ${
                      isStudent ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span className="text-xs font-medium text-gray-600">
                      {isAI ? "🤖 AI System" : "User"}
                    </span>
                    {getRoleBadge(msg.senderRole)}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`flex ${isStudent ? "justify-end" : "justify-start"}`}
                  >
                    <div className={getMessageStyle(msg.senderRole)}>
                      <p className="text-sm md:text-base font-normal">
                        {msg.message}
                      </p>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div
                    className={`flex px-2 ${
                      isStudent ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span className="text-xs text-gray-500">
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-400 text-lg">📭 No messages yet</p>
              <p className="text-gray-500 text-sm">Start the conversation!</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="bg-white border-t border-slate-200 shadow-lg p-4">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <Input
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Type your message..."
            className="flex-1 rounded-full border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            disabled={loading}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !loading) {
                sendMessage(otherUserId, courseId);
              }
            }}
          />
          <Button
            onClick={() => sendMessage(otherUserId, courseId)}
            disabled={loading || !formData.message.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2 flex items-center gap-2"
          >
            <Send size={18} />
            <span className="hidden sm:inline">
              {loading ? "Sending..." : "Send"}
            </span>
          </Button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          Press Enter or click Send
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Chat;
