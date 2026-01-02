"use client";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import api from "@/lib/axios";
import socket from "@/utils/socket";
import Navbar from "@/app/components/NavBar";
import {
  Search,
  MessageSquare,
  Clock,
  Loader2,
  ArrowLeft,
  Send,
  MoreVertical,
} from "lucide-react";

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);
  const { currentUser } = useSelector((state) => state.auth);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      message: "",
    },
  });

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get("/chat/conversations");
        const sorted = (res.data.conversations || []).sort((a, b) => {
          const dateA = a.lastMessage?.createdAt || a.updatedAt;
          const dateB = b.lastMessage?.createdAt || b.updatedAt;
          return new Date(dateB) - new Date(dateA);
        });
        setConversations(sorted);
        setFilteredConversations(sorted);
      } catch (err) {
        console.error("Error fetching conversations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  // Filter conversations
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter((convo) => {
        const otherUser = convo.participants.find(
          (p) => p._id !== currentUser?._id
        );
        const name =
          `${otherUser?.firstName} ${otherUser?.lastName}`.toLowerCase();
        return name.includes(searchQuery.toLowerCase());
      });
      setFilteredConversations(filtered);
    }
  }, [searchQuery, conversations, currentUser]);

  // Load conversation and messages when selected
  useEffect(() => {
    if (!selectedConversationId || !currentUser) return;

    loadConversation();

    // Join socket room - ensure socket is connected
    const joinRoom = () => {
      socket.emit("join_conversation", selectedConversationId);
    };

    if (socket.connected) {
      joinRoom();
    } else {
      socket.once("connect", joinRoom);
    }

    return () => {
      if (socket.connected) {
        socket.emit("leave_conversation", selectedConversationId);
      }
    };
  }, [selectedConversationId, currentUser]);

  // Socket.io listeners
  useEffect(() => {
    if (!selectedConversationId) return;

    const handleReceiveMessage = (data) => {
      const { message, conversationId: msgConvId } = data;

      // Update messages if in current conversation
      if (selectedConversationId === msgConvId) {
        setMessages((prev) => {
          // Prevent duplicates
          if (prev.some((m) => m._id === message._id)) {
            return prev;
          }
          return [...prev, message];
        });
      }

      // Update conversations list with new last message
      setConversations((prev) => {
        const updated = prev.map((conv) => {
          if (conv._id === msgConvId) {
            return {
              ...conv,
              lastMessage: message,
              updatedAt: message.createdAt,
            };
          }
          return conv;
        });

        // Sort by updatedAt
        return updated.sort((a, b) => {
          const dateA = a.lastMessage?.createdAt || a.updatedAt;
          const dateB = b.lastMessage?.createdAt || b.updatedAt;
          return new Date(dateB) - new Date(dateA);
        });
      });

      // Update selected conversation if it's the current one
      if (selectedConversationId === msgConvId) {
        setSelectedConversation((prev) => ({
          ...prev,
          lastMessage: message,
          updatedAt: message.createdAt,
        }));
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [selectedConversationId]);
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversation = async () => {
    try {
      setChatLoading(true);

      // Load messages
      const response = await api.get(`/chat/${selectedConversationId}`);
      setMessages(response.data.messages || []);

      // Find conversation from list
      const foundConv = conversations.find(
        (c) => c._id === selectedConversationId
      );

      if (foundConv) {
        setSelectedConversation(foundConv);

        // Get other participant
        const other = foundConv.participants.find(
          (p) => p._id !== currentUser._id
        );
        setOtherUser(other);
      }

      setChatLoading(false);
    } catch (error) {
      console.error("Error loading conversation:", error);
      setChatLoading(false);
    }
  };

  const handleConversationClick = (e, conversationId) => {
    // Check if screen is large (lg+)
    if (window.innerWidth >= 1024) {
      // Large screen: update state for split view and prevent navigation
      e.preventDefault();
      setSelectedConversationId(conversationId);
    }
    // Small screen: let Link component handle navigation
  };

  const onSubmit = async (data) => {
    if (!data.message.trim() || !otherUser) return;

    const content = data.message.trim();
    reset();

    try {
      await api.post("/chat/send", {
        receiverId: otherUser._id,
        content,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      reset({ message: content });
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else if (diffInHours < 168) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <Loader2
          className="animate-spin text-primary dark:text-primary-dark"
          size={48}
        />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-6rem)] lg:h-screen bg-gray-50 dark:bg-background-dark flex flex-col lg:flex-row pt-24 lg:pt-24 lg:overflow-hidden">
        {/* Back to home link - only visible on small screens */}
        <div className="lg:hidden">
          <Link
            href={"/"}
            className="flex gap-2 items-center m-2 hover:text-primary dark:hover:text-primary-dark transition-colors dark:text-paragraph"
          >
            <ArrowLeft />
            <span>Back to home</span>
          </Link>
        </div>

        {/* Messages List - Left Side (40% on large screens) */}
        <div className="lg:w-2/5 lg:max-w-md lg:border-r lg:border-gray-200 lg:dark:border-background/20 lg:h-full lg:flex lg:flex-col">
          <div className="border-b border-gray-200 dark:border-background/20 sticky top-24 lg:top-0 z-10 bg-gray-50 dark:bg-background-dark lg:bg-white lg:dark:bg-background/10">
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-background mb-4">
                Messages
              </h1>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-paragraph w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background dark:placeholder-background/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-primary-dark focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Conversations List */}
          <div className="p-4 flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="bg-white dark:bg-background/10 rounded-2xl p-12 text-center border border-gray-100 dark:border-background/20">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-background/20 flex items-center justify-center">
                  <MessageSquare className="w-10 h-10 text-gray-400 dark:text-paragraph" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-background mb-2">
                  {searchQuery
                    ? "No conversations found"
                    : "No conversations yet"}
                </h2>
                <p className="text-gray-500 dark:text-paragraph">
                  {searchQuery
                    ? "Try searching for a different name"
                    : "Start a conversation from a project"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredConversations.map((convo) => {
                  const otherUser = convo.participants.find(
                    (p) => p._id !== currentUser?._id
                  );

                  const name = otherUser
                    ? `${otherUser.firstName} ${otherUser.lastName}`
                    : "Unknown User";

                  const lastMessage =
                    convo.lastMessage?.content || "No messages yet";

                  const messageTime =
                    convo.lastMessage?.createdAt || convo.updatedAt;

                  const isSelected = selectedConversationId === convo._id;

                  return (
                    <Link
                      key={convo._id}
                      href={`/chat/${convo._id}`}
                      onClick={(e) => handleConversationClick(e, convo._id)}
                      className={`block rounded-2xl p-4 hover:shadow-md hover:scale-[1.01] transition-all duration-200 border ${
                        isSelected
                          ? "bg-blue-50 dark:bg-primary-dark/10 border-blue-200 dark:border-primary-dark/30"
                          : "bg-white dark:bg-background/10 border-gray-100 dark:border-background/20"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        {otherUser?.profilePicUrl ? (
                          <div className="w-14 h-14 rounded-full overflow-hidden">
                            <img
                              src={otherUser.profilePicUrl}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark flex items-center justify-center text-white font-semibold">
                            {otherUser?.firstName?.charAt(0)}
                            {otherUser?.lastName?.charAt(0)}
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-background text-lg truncate">
                              {name}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-paragraph ml-2 flex-shrink-0">
                              <Clock className="w-3 h-3" />
                              <span>{formatTime(messageTime)}</span>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 dark:text-paragraph truncate">
                            {lastMessage.length > 60
                              ? `${lastMessage.slice(0, 60)}...`
                              : lastMessage}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Chat View - Right Side (60% on large screens) */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:h-full">
          {selectedConversationId && otherUser ? (
            <>
              {/* Chat Header */}
              <div className="bg-white dark:bg-background/10 border-b border-gray-200 dark:border-background/20 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {otherUser?.profilePicUrl ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img
                          src={otherUser.profilePicUrl}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark flex items-center justify-center text-white font-semibold">
                        {otherUser?.firstName?.charAt(0)}
                        {otherUser?.lastName?.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h2 className="font-semibold text-gray-900 dark:text-background">
                        {otherUser?.firstName} {otherUser?.lastName}
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-paragraph">
                        {otherUser?.email}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-background/20 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-600 dark:text-background" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-background-dark">
                {chatLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2
                      className="animate-spin text-primary dark:text-primary-dark"
                      size={32}
                    />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500 dark:text-paragraph">
                      <Send className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-paragraph" />
                      <p className="text-lg">No messages yet</p>
                      <p className="text-sm mt-2">
                        Send a message to start the conversation
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isOwnMessage =
                        message.sender._id === currentUser._id;
                      return (
                        <div
                          key={message._id}
                          className={`flex ${
                            isOwnMessage ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl shadow-sm ${
                              isOwnMessage
                                ? "bg-blue-600 dark:from-primary-dark dark:to-secondary-dark dark:bg-gradient-to-r text-white"
                                : "bg-white dark:bg-background/10 text-gray-900 dark:text-background border border-gray-200 dark:border-background/20"
                            }`}
                          >
                            {!isOwnMessage && (
                              <p className="text-xs font-semibold mb-1 text-gray-600 dark:text-paragraph">
                                {message.sender.firstName}{" "}
                                {message.sender.lastName}
                              </p>
                            )}
                            <p className="break-words">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isOwnMessage
                                  ? "text-blue-100 dark:text-background/80"
                                  : "text-gray-500 dark:text-paragraph"
                              }`}
                            >
                              {formatTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white dark:bg-background/10 border-t border-gray-200 dark:border-background/20 p-4"
              >
                <div className="flex items-center space-x-3">
                  <Controller
                    name="message"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background dark:placeholder-background/30 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-primary-dark focus:border-transparent"
                      />
                    )}
                  />
                  <button
                    type="submit"
                    className="p-3 bg-blue-600 dark:bg-primary-dark text-white dark:text-background rounded-full hover:bg-blue-700 dark:hover:bg-primary-dark/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-background-dark">
              <div className="text-center text-gray-500 dark:text-paragraph">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-paragraph" />
                <p className="text-lg">
                  Select a conversation to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
