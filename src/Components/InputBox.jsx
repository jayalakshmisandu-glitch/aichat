import { useState } from "react";

export default function InputBox({ sendMessage }) {
  const [text, setText] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim()) return;
        sendMessage(text);
        setText("");
      }}
      className="flex gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-2xl shadow-black/30"
    >
      <input
        className="flex-1 rounded-xl border-0 bg-transparent px-2 text-sm text-zinc-950 outline-none placeholder:text-zinc-500"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Message"
      />

      <button
        type="submit"
        disabled={!text.trim()}
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400"
        aria-label="Send message"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.429 5.951 1.429a1 1 0 001.169-1.409l-7-14z" />
        </svg>
      </button>
    </form>
  );
}
