import { useEffect, useRef } from "react";
import { useChat } from "@/context/chat-context";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  Clock,
  Loader2,
  Check,
  CheckCheck,
  CircleDot,
} from "lucide-react";

const Chat = ({ courseIdProp, otherUserIdProp, embedded = false }) => {
  const params = useParams();
  const courseId = courseIdProp || params.courseId;
  const otherUserId = otherUserIdProp || params.otherUserId;
  const messagesEndRef = useRef(null);

  const {
    messages,
    formData,
    handleChange,
    sendMessage,
    fetchMessages,
    loading,
    typing,
    onlineUsers,
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
  }, [messages, typing]);

  const isOtherUserOnline = onlineUsers.has(otherUserId);

  const rootClass = embedded
    ? "flex flex-col h-full"
    : "flex h-screen max-h-screen gap-4 p-4 bg-gradient-to-br from-slate-50 to-slate-100";

  return (
    <div className={rootClass}>
      {/* Chat Area */}
      <div className="flex-1 flex flex-col shadow-xl border-0 overflow-hidden rounded-2xl bg-white">
        {/* Header */}
        <div
          className="border-b-4 pb-4 px-6 pt-4 flex items-center justify-between"
          style={{ backgroundColor: "#142C52", borderColor: "#16808D" }}
        >
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-white text-lg font-bold">
                Message Instructor
              </h3>
              <div className="flex items-center gap-1">
                <CircleDot
                  className={`h-3 w-3 ${
                    isOtherUserOnline
                      ? "text-green-400 fill-green-400"
                      : "text-gray-400"
                  }`}
                />
                <span className="text-gray-300 text-xs">
                  {isOtherUserOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>
            <p className="text-gray-300 text-sm mt-1">
              Course: {courseId?.substring(0, 12)}...
            </p>
          </div>
        </div>

        {/* Messages Container */}
        <div
          className="flex-1 overflow-y-auto p-6 flex flex-col"
          style={{ backgroundColor: "#F5F7FA" }}
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <p className="text-lg">💬 No messages yet</p>
                <p className="text-sm">Start the conversation!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg, index) => {
                // Determine if this message is from the student (sender)
                const isStudent = msg.senderRole === "student";
                const isAI = msg.senderRole === "ai";

                const currentDate = new Date(
                  msg.createdAt,
                ).toLocaleDateString();
                const prevDate =
                  index > 0
                    ? new Date(
                        messages[index - 1].createdAt,
                      ).toLocaleDateString()
                    : null;
                const showDateSeparator = currentDate !== prevDate;

                return (
                  <div key={msg._id}>
                    {showDateSeparator && (
                      <div className="flex justify-center my-4">
                        <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                          {new Date(msg.createdAt).toLocaleDateString([], {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                    <div
                      className={`flex ${isStudent ? "justify-end" : "justify-start"}`}
                    >
                      <div className="flex flex-col gap-1">
                        <div
                          className={`px-4 py-2 rounded-2xl shadow-sm max-w-md ${
                            isStudent
                              ? "text-white rounded-tr-none"
                              : isAI
                                ? "bg-blue-50 text-gray-800 rounded-tl-none border border-blue-200"
                                : "bg-white text-gray-800 rounded-tl-none border border-gray-200"
                          }`}
                          style={
                            isStudent ? { backgroundColor: "#16808D" } : {}
                          }
                        >
                          {isAI && (
                            <p className="text-xs font-semibold text-blue-600 mb-1">
                              🤖 AI Assistant
                            </p>
                          )}
                          <p className="text-sm leading-relaxed break-words">
                            {msg.message}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 text-gray-500 flex items-center gap-1 ${
                            isStudent ? "justify-end" : "justify-start"
                          }`}
                        >
                          <Clock className="h-3 w-3" />
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {typing && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl rounded-tl-none border border-gray-200">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 ml-1">
                      Instructor is typing...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div
          className="border-t-4 p-4 flex gap-3"
          style={{ backgroundColor: "#F5F7FA", borderColor: "#16808D" }}
        >
          <Input
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Type your message..."
            className="flex-1 border-gray-300 rounded-xl focus:border-2 focus:ring-0"
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
            className="text-white rounded-xl px-6 transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: "#16808D" }}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
