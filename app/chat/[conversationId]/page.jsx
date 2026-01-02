"use client";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import {
  Send,
  ArrowLeft,
  MoreVertical,
  Phone,
  Video,
  Loader2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import socket from "@/utils/socket";
import api from "@/lib/axios";
import Link from "next/link";

const ChatPage = () => {
  const router = useRouter();
  const { conversationId } = useParams();
  const { currentUser } = useSelector((state) => state.auth);

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      message: "",
    },
  });

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversation and messages
  useEffect(() => {
    if (!conversationId || !currentUser) return;

    loadConversation();

    // Join socket room - ensure socket is connected
    const joinRoom = () => {
      socket.emit("join_conversation", conversationId);
    };

    if (socket.connected) {
      joinRoom();
    } else {
      socket.once("connect", joinRoom);
    }

    return () => {
      if (socket.connected) {
        socket.emit("leave_conversation", conversationId);
      }
    };
  }, [conversationId, currentUser]);

  // Socket.io listeners
  useEffect(() => {
    if (!conversationId) return;

    const handleReceiveMessage = (data) => {
      const { message, conversationId: msgConvId } = data;

      // Update messages if in current conversation
      if (conversationId === msgConvId) {
        setMessages((prev) => {
          // Prevent duplicates
          if (prev.some((m) => m._id === message._id)) {
            return prev;
          }
          return [...prev, message];
        });
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [conversationId]);
  const loadConversation = async () => {
    try {
      setLoading(true);

      // Load messages
      const response = await api.get(`/chat/${conversationId}`);
      setMessages(response.data.messages || []);

      // Load conversation details
      const convResponse = await api.get("/chat/conversations");
      const foundConv = convResponse.data.conversations.find(
        (c) => c._id === conversationId
      );

      if (foundConv) {
        setConversation(foundConv);

        // Get other participant
        const other = foundConv.participants.find(
          (p) => p._id !== currentUser._id
        );
        setOtherUser(other);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading conversation:", error);
      setLoading(false);
    }
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
      // Optionally restore message on error
      reset({ message: content });
    }
  };

  const formatTime = (timestamp) => {
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

  if (!conversation || !otherUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-background-dark">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-background">
            Conversation not found
          </p>
          <Link
            href="/chat"
            className="mt-4 px-4 py-2 bg-blue-600 dark:bg-primary-dark text-white dark:text-background rounded-lg hover:bg-blue-700 dark:hover:bg-primary-dark/90"
          >
            Back to Conversations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-background-dark">
      {/* Chat Header */}
      <div className="bg-white dark:bg-background/10 border-b border-gray-200 dark:border-background/20 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <Link
              href="/chat"
              className="p-2 hover:bg-gray-100 dark:hover:bg-background/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 dark:text-background" />
            </Link>
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
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
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
            messages.map((message) => {
              const isOwnMessage = message.sender._id === currentUser._id;
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
                        {message.sender.firstName} {message.sender.lastName}
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
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-background/10 border-t border-gray-200 dark:border-background/20 p-4"
      >
        <div className="max-w-4xl mx-auto flex items-center space-x-3">
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
    </div>
  );
};

export default ChatPage;
