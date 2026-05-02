export default function Sidebar({ sessions, activeSessionId, onNewChat, onSelectSession, onLogout }) {
  return (
    <aside className="hidden w-72 flex-col border-r border-white/10 bg-[#111113] text-white sm:flex">
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-black">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
            <path d="M12 3L4 7.5V16.5L12 21L20 16.5V7.5L12 3Z" stroke="currentColor" strokeWidth="1.8" />
            <path d="M8.5 12H15.5M12 8.5V15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold">AI Chat</p>
          <p className="text-xs text-zinc-500">Conversation</p>
        </div>
      </div>

      <div className="px-4 py-4">
        <button
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm font-medium text-white transition hover:bg-white/10"
        >
          <span className="text-lg leading-none">+</span>
          New chat
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-2">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`w-full truncate rounded-lg px-3 py-2 text-left text-sm transition ${
                session.id === activeSessionId
                  ? "bg-white text-black"
                  : "text-zinc-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {session.title}
            </button>
          ))}
        </div>
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          onClick={onLogout}
          className="w-full rounded-lg bg-white px-3 py-2 text-left text-sm font-semibold text-black transition hover:bg-zinc-200"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
