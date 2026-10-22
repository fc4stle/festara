"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMsg("Email wajib diisi");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);

    if (error) {
      const isRateLimit = error.status === 429 || error.message.toLowerCase().includes("rate limit");
      setErrorMsg(
        isRateLimit
          ? "Terlalu banyak permintaan. Coba lagi beberapa menit lagi."
          : "Gagal mengirim link reset. Coba lagi sebentar."
      );
      return;
    }

    setSent(true);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="bg-white/90 backdrop-blur rounded-3xl shadow-sm p-6 md:p-8 w-full max-w-md">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4A7A6D] hover:text-[#1CABB4] mb-5"
        >
          <ArrowLeft size={13} /> Kembali ke Masuk
        </Link>

        {sent ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-[#DCFCE7] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={24} className="text-[#15803D]" />
            </div>
            <h1 className="font-extrabold text-lg text-[#1A3A3C] mb-2">Cek email kamu</h1>
            <p className="text-sm text-[#4A7A6D] leading-relaxed mb-5">
              Kalau email <span className="font-semibold">{email.trim()}</span> terdaftar, link untuk mengatur ulang
              password sudah dikirim. Cek juga folder spam.
            </p>
            <Link
              href="/login"
              className="inline-block w-full bg-[#1CABB4] text-white font-bold py-3 rounded-xl hover:bg-[#178E96] transition-colors"
            >
              Kembali ke Masuk
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-extrabold text-xl text-[#1A3A3C] mb-1">Lupa password?</h1>
            <p className="text-sm text-[#8ABDB5] mb-5">
              Masukkan email akunmu. Kami kirim link untuk membuat password baru.
            </p>

            {errorMsg && (
              <div className="bg-[#FEF2F2] border border-[#EF4444]/20 rounded-xl px-4 py-3 mb-4">
                <p className="text-sm text-[#EF4444]">{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#4A7A6D] block mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8ABDB5]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    autoComplete="email"
                    required
                    className="w-full border border-[#D4EAC8] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4] bg-[#F0FBF5]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#1CABB4] text-white font-bold py-3 rounded-xl hover:bg-[#178E96] transition-colors disabled:opacity-60"
              >
                {loading && <Loader2 size={15} className="animate-spin" />}
                {loading ? "Mengirim..." : "Kirim Link Reset"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
