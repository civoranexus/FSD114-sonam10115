import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Send,
  Search,
  Loader2,
  MessageSquare,
  Clock,
  User,
  RefreshCw,
} from "lucide-react";
import {
  fetchMessagesApi,
  sendMessageApi,
  fetchInstructorConversationsService,
} from "@/services";

const InstructorChat = ({ instructorId }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load conversations from server
  const loadConversations = async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading conversations...");
      const response = await fetchInstructorConversationsService();
      console.log("📥 API Response:", response);
      if (response?.success && response?.data) {
        setConversations(response.data);
        console.log("✅ Conversations loaded:", response.data);
      } else {
        console.warn("⚠️ Invalid response structure:", response);
      }
    } catch (error) {
      console.error("❌ Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load messages for selected student
  const loadMessages = async (courseId, studentId) => {
    try {
      setLoading(true);
      console.log(
        "📬 Fetching messages for course:",
        courseId,
        "student:",
        studentId,
      );
      const res = await fetchMessagesApi(courseId, studentId);
      console.log("📥 Messages API response:", res);
      if (res?.data && Array.isArray(res.data)) {
        // Sort messages by creation time (oldest first)
        const sortedMessages = res.data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        );
        setMessages(sortedMessages);
        console.log("✅ Messages loaded:", sortedMessages.length);
      } else {
        console.warn("⚠️ No messages in response");
        setMessages([]);
      }
    } catch (error) {
      console.error("❌ Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedStudent?.courseId && selectedStudent?.studentId) {
      console.log("📨 Loading messages for selected student:", selectedStudent);
      loadMessages(selectedStudent.courseId, selectedStudent.studentId);
    }
  }, [selectedStudent]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedStudent) return;

    try {
      setLoading(true);

      // Send message as instructor to student
      const res = await sendMessageApi({
        receiverId: selectedStudent.studentId,
        courseId: selectedStudent.courseId,
        message: messageText,
      });

      if (res?.message) {
        setMessages((prev) => [...prev, res.message]);
        setMessageText("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.studentName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div
      className="flex h-screen max-h-screen gap-4 p-4"
      style={{ backgroundColor: "#142C52" }}
    >
      {/* Conversations List - Left Panel */}
      <div className="w-80 flex flex-col shadow-xl border-0 overflow-hidden rounded-2xl bg-white">
        <div className="pb-4 px-4 pt-4" style={{ backgroundColor: "#142C52" }}>
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-white" />
            <h2 className="text-white text-lg font-bold">Student Messages</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-300" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-lg border-0 text-gray-800 placeholder-gray-400"
              style={{ backgroundColor: "#E8F0F5" }}
            />
          </div>
        </div>
        <div
          className="flex-1 overflow-y-auto space-y-3 p-4"
          style={{ backgroundColor: "#F5F7FA" }}
        >
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => (
              <div
                key={`${conv.studentId}_${conv.courseId}`}
                onClick={() => {
                  console.log("👤 Selected student:", conv);
                  setSelectedStudent(conv);
                }}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedStudent?.studentId === conv.studentId
                    ? "text-white shadow-lg"
                    : "bg-white text-gray-800 border border-gray-200 hover:shadow-md"
                }`}
                style={
                  selectedStudent?.studentId === conv.studentId
                    ? { backgroundColor: "#16808D" }
                    : {}
                }
              >
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">
                      {conv.studentName}
                    </p>
                    <p
                      className={`text-xs mt-1 truncate ${
                        selectedStudent?.studentId === conv.studentId
                          ? "text-teal-50"
                          : "text-gray-500"
                      }`}
                    >
                      {conv.courseName}
                    </p>
                    <p
                      className={`text-xs mt-2 line-clamp-2 ${
                        selectedStudent?.studentId === conv.studentId
                          ? "text-teal-50"
                          : "text-gray-600"
                      }`}
                    >
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No conversations yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area - Right Panel */}
      <div className="flex-1 flex flex-col shadow-xl border-0 overflow-hidden rounded-2xl bg-white">
        {selectedStudent ? (
          <>
            {/* Chat Header */}
            <div
              className="border-b-4 pb-4 px-6 pt-4 flex justify-between items-center"
              style={{ backgroundColor: "#142C52", borderColor: "#16808D" }}
            >
              <div>
                <h3 className="text-white text-lg font-bold">
                  {selectedStudent.studentName}
                </h3>
                <p className="text-gray-300 text-sm mt-1">
                  {selectedStudent.courseName}
                </p>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <div>
                  <p className="text-xs text-gray-300">Total Messages</p>
                  <p className="text-3xl font-bold text-white">
                    {messages.length}
                  </p>
                </div>
                <button
                  onClick={() =>
                    loadMessages(
                      selectedStudent.courseId,
                      selectedStudent.studentId,
                    )
                  }
                  className="text-white hover:opacity-80 transition p-1 rounded"
                  title="Refresh messages"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
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
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p>No messages yet</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg, index) => {
                    const isInstructor = msg.senderRole === "teacher";

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
                          className={`flex ${isInstructor ? "justify-end" : "justify-start"}`}
                        >
                          <div className="flex flex-col gap-1">
                            <div
                              className={`px-4 py-2 rounded-2xl shadow-sm max-w-md ${
                                isInstructor
                                  ? "text-white rounded-tr-none"
                                  : "bg-white text-gray-800 rounded-tl-none border border-gray-200"
                              }`}
                              style={
                                isInstructor
                                  ? { backgroundColor: "#16808D" }
                                  : {}
                              }
                            >
                              <p className="text-sm leading-relaxed break-words">
                                {msg.message}
                              </p>
                            </div>
                            <span
                              className={`text-xs px-2 text-gray-500 flex items-center gap-1 ${
                                isInstructor ? "justify-end" : "justify-start"
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
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !loading) {
                    handleSendMessage();
                  }
                }}
                disabled={loading}
                className="flex-1 border-gray-300 rounded-xl focus:border-2 focus:ring-0"
              />
              <Button
                onClick={handleSendMessage}
                disabled={loading || !messageText.trim()}
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
          </>
        ) : (
          <div
            className="flex items-center justify-center h-full"
            style={{ backgroundColor: "#F5F7FA" }}
          >
            <div className="text-center">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600 text-lg font-semibold">
                Select a student to start chatting
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Your conversations will appear here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorChat;
