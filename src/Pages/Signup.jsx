import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Services/api";

export default function Signup() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const register = async () => {
    try {
      await api.post("/auth/signup", form);
      alert("Account created!");
      navigate("/");
    } catch {
      alert("Error creating account");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-zinc-200 to-slate-300 px-4 py-8 text-white">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/10 bg-white shadow-2xl shadow-black md:grid-cols-[390px_1fr]">
        <section className="bg-white p-8 text-zinc-950 sm:p-10">
        <h2 className="text-3xl font-semibold">Register</h2>
        <p className="mt-2 text-sm text-zinc-500">Create your account and start chatting.</p>

        <div className="mt-8">
        <input
          type="email"
          className="mb-4 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-4 text-zinc-950 placeholder:text-zinc-400 outline-none transition focus:border-black"
          placeholder="Email"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          className="mb-6 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-4 text-zinc-950 placeholder:text-zinc-400 outline-none transition focus:border-black"
          placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={register}
          className="w-full rounded-2xl bg-black py-4 font-semibold text-white shadow-lg shadow-black/10 transition hover:bg-zinc-800"
        >
          Register
        </button>
        </div>

        <p
          className="mt-6 cursor-pointer text-center text-sm text-zinc-500 hover:text-black"
          onClick={() => navigate("/")}
        >
          Already have an account? <span className="font-semibold text-black underline underline-offset-4">Login</span>
        </p>
        </section>

        <section className="hidden min-h-[500px] flex-col justify-between bg-[#1f2937] p-8 md:flex">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-black">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L4 7.5V16.5L12 21L20 16.5V7.5L12 3Z" stroke="currentColor" strokeWidth="1.8" />
                <path d="M8.5 12H15.5M12 8.5V15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold">AI Chat</p>
              <p className="text-sm text-slate-300">Your assistant workspace</p>
            </div>
          </div>

          <div>
            <h1 className="max-w-md text-5xl font-semibold leading-tight">Create a smarter chat space.</h1>
            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-300">
              Register once, sign in securely, and start talking with the Gemini powered assistant.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
