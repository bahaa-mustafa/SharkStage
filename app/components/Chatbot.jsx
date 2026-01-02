"use client";
import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize with welcome messages
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessages = {
        en: "Hello! I'm the SharkStage assistant. How can I help you today?",
        ar: "مرحباً! أنا مساعد SharkStage. كيف يمكنني مساعدتك اليوم؟",
      };
      setMessages([
        {
          role: "assistant",
          content: welcomeMessages[language],
          language: language,
        },
      ]);
    }
  }, [isOpen, language]);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: input.trim(),
      language: language,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const conversationHistory = messages
        .filter((m) => m.role !== "system")
        .slice(-5)
        .map((m) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content,
        }));

      const response = await fetch(`${API_URL}/chatbot/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userMessage.content,
          language: language,
          conversationHistory: conversationHistory,
        }),
      });

      // Get response text first to see what we're getting
      const responseText = await response.text();
      console.log("Response status:", response.status);
      console.log("Response text:", responseText);

      if (!response.ok) {
        let errorMessage = "Failed to get response";
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = JSON.parse(responseText);

      // Check if response has answer
      if (!data.answer && !data.message) {
        throw new Error("No answer received from server");
      }

      const assistantMessage = {
        role: "assistant",
        content: data.answer || data.message,
        language: language,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      console.error("Error details:", error.message);
      const errorMessage = {
        role: "assistant",
        content:
          language === "ar"
            ? `عذراً، حدث خطأ: ${error.message}. يرجى التحقق من أن السيرفر يعمل على ${API_URL}`
            : `Sorry, an error occurred: ${error.message}. Please check if the server is running on ${API_URL}`,
        language: language,
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    const welcomeMessages = {
      en: "Hello! I'm the SharkStage assistant. How can I help you today?",
      ar: "مرحباً! أنا مساعد SharkStage. كيف يمكنني مساعدتك اليوم؟",
    };
    setMessages([
      {
        role: "assistant",
        content: welcomeMessages[language],
        language: language,
      },
    ]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleLanguage = () => {
    const newLang = language === "en" ? "ar" : "en";
    setLanguage(newLang);
    clearChat();
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-primary to-secondary dark:to-heading text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          aria-label="Open chatbot"
        >
          <Bot className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-white dark:bg-background-dark rounded-2xl shadow-2xl flex flex-col ${
            language === "ar" ? "dir-rtl" : "dir-ltr"
          }`}
          style={{ direction: language === "ar" ? "rtl" : "ltr" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary dark:to-heading text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">SharkStage Assistant</h3>
                <p className="text-xs text-white/80">
                  {language === "ar" ? "متصل" : "Online"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleLanguage}
                className="text-sm px-2 py-1 bg-white/20 rounded hover:bg-white/30 transition"
              >
                {language === "en" ? "عربي" : "EN"}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded transition"
                aria-label="Close chatbot"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-background/10">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-primary to-secondary dark:to-heading text-white"
                      : message.isError
                      ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800/30"
                      : "bg-white dark:bg-background/10 text-gray-800 dark:text-background shadow-sm border border-gray-200 dark:border-0"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-background/10 rounded-2xl px-4 py-2 shadow-sm border border-gray-200 dark:border-0">
                  <Loader2 className="w-5 h-5 text-primary dark:text-primary-dark animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 dark:border-background/30 bg-white dark:bg-background-dark rounded-b-2xl">
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className="text-xs text-gray-500 dark:text-paragraph hover:text-gray-700 dark:hover:text-background px-2 py-1"
                title={language === "ar" ? "مسح المحادثة" : "Clear chat"}
              >
                {language === "ar" ? "مسح" : "Clear"}
              </button>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  language === "ar"
                    ? "اكتب سؤالك هنا..."
                    : "Type your question here..."
                }
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-0 dark:bg-background/10 dark:text-background dark:placeholder-background/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-primary to-secondary dark:to-heading text-white p-2 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                aria-label="Send message"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
