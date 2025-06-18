"use client";
import React, { useState, useRef, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";

interface Message {
  role: "user" | "bot";
  content: string;
}

function LoadingDots() {
  return (
    <span className="inline-block w-6 text-blue-500 animate-pulse">...
    </span>
  );
}

export default function PlaygroundPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { role: "user", content: input }]);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      if (!res.ok) throw new Error("Failed to get response");
      const data = await res.json();
      setMessages((msgs) => [
        ...msgs,
        { role: "bot", content: data.response || "(No response)" },
      ]);
    } catch (e: any) {
      setError(e.message || "Unknown error");
      setMessages((msgs) => [
        ...msgs,
        { role: "bot", content: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      sendMessage();
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-blue-100 via-white to-blue-200 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full opacity-30 blur-2xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full opacity-20 blur-3xl -z-10" />
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-6 sm:px-12 sm:py-8 shadow-md bg-white/80 z-10 w-full justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <Image src="/globe.svg" alt="Bot" width={32} height={32} />
          </span>
          <h2 className="text-3xl font-extrabold text-blue-900 tracking-tight">Startup AI Chat</h2>
        </div>
        <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow text-sm transition">
          &larr; Back to Home
        </Link>
      </div>
      {/* Chat Window */}
      <div className="flex-1 min-h-0 flex flex-col w-full max-w-3xl mx-auto px-2 sm:px-0">
        <div className="flex-1 min-h-0 overflow-y-auto py-6 space-y-4 pr-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent hover:scrollbar-thumb-blue-400 transition-all duration-200" style={{ scrollbarWidth: 'thin' }}>
          {messages.length === 0 && !loading && (
            <div className="text-gray-400 text-center mt-16 text-lg">Say hello to your AI assistant!</div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "bot" && (
                <Avatar className="bg-blue-100">
                  <Image src="/globe.svg" alt="Bot" width={28} height={28} />
                </Avatar>
              )}
              <div
                className={`px-4 py-2 rounded-2xl shadow text-base max-w-md break-words transition-all duration-200 ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-md animate-fadeInRight"
                    : "bg-gray-100 text-gray-900 rounded-bl-md animate-fadeInLeft"
                }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <Avatar className="bg-blue-600 text-white font-bold">
                  <span>U</span>
                </Avatar>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-end gap-2 justify-start">
              <Avatar className="bg-blue-100">
                <Image src="/globe.svg" alt="Bot" width={28} height={28} />
              </Avatar>
              <div className="px-4 py-2 rounded-2xl shadow bg-gray-100 text-gray-900 text-base animate-pulse">
                <LoadingDots />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        {/* Input Area */}
        <div className="flex gap-2 pb-8 pt-2 sticky bottom-0 bg-gradient-to-t from-white/90 via-white/60 to-transparent z-10">
          <input
            type="text"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base shadow-sm"
            placeholder={loading ? "Waiting for response..." : "Type your message and press Enter..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            autoFocus
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow text-base transition disabled:opacity-50"
            disabled={loading || !input.trim()}
          >
            {loading ? <LoadingDots /> : "Send"}
          </button>
        </div>
      </div>
      {/* Footer */}
      <div className="w-full flex justify-center items-center py-3 bg-white/70 text-gray-400 text-xs gap-2 z-10 border-t">
        <Image src="/globe.svg" alt="Groq" width={18} height={18} />
        Powered by Groq AI
      </div>
      <style jsx global>{`
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeInLeft { animation: fadeInLeft 0.4s; }
        .animate-fadeInRight { animation: fadeInRight 0.4s; }
        /* Custom scrollbar for chat area */
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        .scrollbar-thumb-blue-200::-webkit-scrollbar-thumb {
          background: #bfdbfe;
          border-radius: 8px;
        }
        .scrollbar-thumb-blue-400::-webkit-scrollbar-thumb:hover {
          background: #60a5fa;
        }
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
        }
      `}</style>
    </div>
  );
} 