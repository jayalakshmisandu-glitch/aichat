export default function MessageBubble({ message }) {
  return (
    <div className={`flex ${ message.role === "user" ? "justify-end" : "justify-start" }`}>
      <div className={`max-w-md rounded-2xl px-4 py-3 text-sm leading-6 whitespace-pre-wrap break-words shadow-sm ${
        message.role === "user"
          ? "bg-white text-black"
          : "bg-[#1f1f23] text-zinc-100 border border-white/10"
      }`}>
        {message.text}
      </div>
    </div>
  );
}
