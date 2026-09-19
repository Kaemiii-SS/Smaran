import { useState, useEffect, useRef } from 'react';
import { Send, Trash2, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API = import.meta.env.VITE_API_URL;

function getToken() {
  return localStorage.getItem('token');
}

export default function GeminiChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Safe JSON parser — never throws on empty/non-JSON bodies
  const safeJson = async (res) => {
    const text = await res.text();
    if (!text || !text.trim()) return {};
    try { return JSON.parse(text); } catch { return { _raw: text }; }
  };

  // Load history from backend on mount
  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch(`${API}/api/gemini/history`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = await safeJson(res);
        if (res.ok) setMessages(data.messages || []);
        // Non-ok history fetch is non-fatal — just start fresh
      } catch {
        // Network error — start fresh silently
      } finally {
        setHistoryLoading(false);
        inputRef.current?.focus();
      }
    }
    fetchHistory();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    // Optimistically add user message
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API}/api/gemini/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await safeJson(res);

      if (!res.ok) {
        throw new Error(data.error || `Server error ${res.status}`);
      }

      if (!data.reply) {
        throw new Error('No reply received from AI.');
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setError(err.message);
      setMessages((prev) => prev.slice(0, -1)); // remove optimistic user msg
      setInput(text); // restore input so user can retry
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = async () => {
    try {
      const res = await fetch(`${API}/api/gemini/history`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Delete failed');
      setMessages([]);
      setError('');
    } catch {
      setError('Could not clear history.');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] w-full max-w-[860px] mx-auto">

      {/* Card */}
      <div className="flex flex-col flex-1 overflow-hidden bg-white/90 border border-white/50 rounded-[2rem] shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-white rounded-t-[2rem]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#0f1912]" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
                AI Companion
              </h2>
              <p className="text-xs font-bold text-[#1a2e22]/60" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
                Powered by Gemini
              </p>
            </div>
          </div>

          {messages.length > 0 && (
            <motion.button
              onClick={clearChat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Clear conversation"
              className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </motion.button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gray-50/50">

          {/* Loading history */}
          {historyLoading && (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-700" />
            </div>
          )}

          {/* Empty state */}
          {!historyLoading && messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center gap-4 py-12">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                <Bot className="w-8 h-8 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-[#0f1912] mb-1" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
                  How can I help you?
                </h3>
                <p className="text-sm font-bold text-[#1a2e22]/60" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
                  Ask me anything — I'm here to help.
                </p>
              </div>

              {/* Suggestion chips */}
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {[
                  "What's the weather like today?",
                  "Can you tell me a short story?",
                  "Remind me what day it is.",
                  "What are some relaxing activities?",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="px-3 py-2 text-xs font-bold text-[#1a2e22] bg-white border border-gray-200 rounded-xl hover:bg-emerald-50 hover:border-emerald-300 transition-colors shadow-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message list */}
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Avatar — assistant only */}
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 flex-shrink-0 mt-1 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-emerald-700" />
                  </div>
                )}

                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm font-semibold leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-[#0f1912] text-white rounded-tr-sm'
                      : 'bg-white border border-gray-200 text-[#0f1912] rounded-tl-sm'
                  }`}
                  style={{ fontFamily: "'Courier New', Courier, monospace" }}
                >
                  {msg.content}
                </div>

                {/* Avatar — user only */}
                {msg.role === 'user' && (
                  <div className="w-8 h-8 flex-shrink-0 mt-1 rounded-xl bg-[#0f1912] flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Thinking indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 justify-start"
            >
              <div className="w-8 h-8 flex-shrink-0 mt-1 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                <Bot className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="px-4 py-3 bg-white border border-gray-200 rounded-2xl rounded-tl-sm shadow-sm">
                <div className="flex gap-1 items-center h-4">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-emerald-500"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Error banner */}
        {error && (
          <div className="mx-6 mb-2 px-4 py-2 bg-red-50 border border-red-200 rounded-xl text-sm font-bold text-red-600">
            {error}
          </div>
        )}

        {/* Input */}
        <div className="p-5 bg-white border-t border-gray-200 rounded-b-[2rem]">
          <form onSubmit={sendMessage} className="relative flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={loading || historyLoading}
              className="flex-1 pl-5 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-[#0f1912] font-semibold placeholder-[#1a2e22]/40 focus:outline-none focus:ring-2 focus:ring-emerald-700/50 shadow-inner disabled:opacity-60"
              style={{ fontFamily: "'Courier New', Courier, monospace" }}
            />
            <motion.button
              type="submit"
              disabled={loading || !input.trim() || historyLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3.5 bg-[#0f1912] disabled:bg-gray-300 hover:bg-emerald-900 text-white rounded-xl transition-colors shadow-md disabled:cursor-not-allowed"
            >
              {loading
                ? <Loader2 className="w-5 h-5 animate-spin" />
                : <Send className="w-5 h-5 ml-0.5" />
              }
            </motion.button>
          </form>
        </div>

      </div>
    </div>
  );
}
