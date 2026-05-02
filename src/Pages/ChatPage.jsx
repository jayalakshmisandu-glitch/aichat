import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Services/api";
import Sidebar from "../Components/Sidebar";
import MessageBubble from "../Components/MessageBubble";
import InputBox from "../Components/InputBox";

export default function ChatPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([
    {
      id: 1,
      title: "New chat",
      messages: [],
      lastMessage: "Start your first conversation",
    },
  ]);
  const [activeSessionId, setActiveSessionId] = useState(1);

  const activeSessionIndex = sessions.findIndex((session) => session.id === activeSessionId);
  const activeSession = sessions[activeSessionIndex] ?? sessions[0];
  const messages = activeSession?.messages ?? [];

  const updateActiveSession = (updatedFields) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === activeSessionId ? { ...session, ...updatedFields } : session
      )
    );
  };

  const handleNewChat = () => {
    const newId = Date.now();
    setSessions((prev) => [
      ...prev,
      {
        id: newId,
        title: `New chat ${prev.length + 1}`,
        messages: [],
        lastMessage: "Start a new conversation",
      },
    ]);
    setActiveSessionId(newId);
  };

  const handleSelectSession = (id) => {
    setActiveSessionId(id);
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      navigate("/");
    }
  };

  const sendMessage = async (text) => {
    const trimmed = text?.trim();
    if (!trimmed) return;

    const newMessages = [...messages, { role: "user", text: trimmed }];
    const title = messages.length === 0 ? trimmed.slice(0, 40) : activeSession.title;
    updateActiveSession({ messages: newMessages, lastMessage: trimmed, title });

    try {
      const res = await api.post("/chat/send", { message: trimmed });

      let aiText = "";
      const full = res.data.response;

      for (let i = 0; i < full.length; i++) {
        aiText += full[i];

        updateActiveSession({
          messages: [...newMessages, { role: "ai", text: aiText }],
          lastMessage: aiText,
        });

        await new Promise((r) => setTimeout(r, 20));
      }
    } catch (error) {
      console.error("Chat send failed", error);
      const message = error.response?.data || error.message || "Failed to send message";
      updateActiveSession({
        messages: [...newMessages, { role: "ai", text: `Error: ${message}` }],
        lastMessage: `Error: ${message}`,
      });
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col bg-[#0b0b0d]">
        <header className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-black">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L4 7.5V16.5L12 21L20 16.5V7.5L12 3Z" stroke="currentColor" strokeWidth="1.8" />
                <path d="M8.5 12H15.5M12 8.5V15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-semibold text-white">AI Chat</h1>
              <p className="text-xs text-zinc-400">Gemini assistant</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm transition hover:bg-zinc-200"
          >
            Logout
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center py-20 text-center">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-black shadow-lg shadow-white/10">
                  <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
                    <path d="M5 7.5C5 6.12 6.12 5 7.5 5H16.5C17.88 5 19 6.12 19 7.5V13.5C19 14.88 17.88 16 16.5 16H11L7 19V16H7.5C6.12 16 5 14.88 5 13.5V7.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="text-4xl font-semibold text-white">How can I help?</h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-zinc-400">Start a conversation or choose a previous chat from the sidebar.</p>
              </div>
            )}
            <div className="space-y-4">
              {messages.map((m, i) => (
                <MessageBubble key={i} message={m} />
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 bg-[#0b0b0d] px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <InputBox sendMessage={sendMessage} />
          </div>
        </div>
      </main>
    </div>
  );
}
