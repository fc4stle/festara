"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Status = "checking" | "ready" | "invalid" | "done";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let active = true;

    // Supabase memicu event PASSWORD_RECOVERY saat link reset valid dibuka
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setStatus("ready");
      }
    });

    async function init() {
      // Kalau sesi sudah terbentuk otomatis dari link
      const { data: sessionData } = await supabase.auth.getSession();
      if (!active) return;
      if (sessionData.session) {
        setStatus("ready");
        return;
      }

      // Kalau belum, coba tukar kode di URL (alur PKCE)
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!active) return;
        if (!error) {
          setStatus("ready");
          return;
        }
      }

      // Beri waktu singkat untuk event auth sebelum dianggap tidak valid
      setTimeout(async () => {
        if (!active) return;
        const { data } = await supabase.auth.getSession();
        if (!active) return;
        setStatus(data.session ? "ready" : "invalid");
      }, 1500);
    }

    init();

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password.length < 6) {
      setErrorMsg("Password minimal 6 karakter");
      return;
    }
    if (password !== confirm) {
      setErrorMsg("Konfirmasi password tidak sama");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setErrorMsg("Gagal menyimpan password baru. Coba minta link reset yang baru.");
      return;
    }

    setStatus("done");
    await supabase.auth.signOut();
    setTimeout(() => router.push("/login"), 2500);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="bg-white/90 backdrop-blur rounded-3xl shadow-sm p-6 md:p-8 w-full max-w-md">
        {status === "checking" && (
          <div className="flex flex-col items-center py-10">
            <div className="w-6 h-6 border-2 border-[#1CABB4] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-[#8ABDB5]">Memeriksa link reset...</p>
          </div>
        )}

        {status === "invalid" && (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-[#FFF7ED] rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} className="text-[#F59E0B]" />
            </div>
            <h1 className="font-extrabold text-lg text-[#1A3A3C] mb-2">Link tidak valid</h1>
            <p className="text-sm text-[#4A7A6D] leading-relaxed mb-5">
              Link reset password sudah kedaluwarsa atau sudah dipakai. Minta link yang baru.
            </p>
            <Link
              href="/forgot-password"
              className="inline-block w-full bg-[#1CABB4] text-white font-bold py-3 rounded-xl hover:bg-[#178E96] transition-colors"
            >
              Minta Link Baru
            </Link>
          </div>
        )}

        {status === "ready" && (
          <>
            <h1 className="font-extrabold text-xl text-[#1A3A3C] mb-1">Buat password baru</h1>
            <p className="text-sm text-[#8ABDB5] mb-5">Masukkan password baru untuk akunmu.</p>

            {errorMsg && (
              <div className="bg-[#FEF2F2] border border-[#EF4444]/20 rounded-xl px-4 py-3 mb-4">
                <p className="text-sm text-[#EF4444]">{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#4A7A6D] block mb-1.5">Password baru</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8ABDB5]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    autoComplete="new-password"
                    required
                    className="w-full border border-[#D4EAC8] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4] bg-[#F0FBF5]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#4A7A6D] block mb-1.5">Ulangi password baru</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8ABDB5]" />
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Ketik ulang password"
                    autoComplete="new-password"
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
                {loading ? "Menyimpan..." : "Simpan Password Baru"}
              </button>
            </form>
          </>
        )}

        {status === "done" && (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-[#DCFCE7] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={24} className="text-[#15803D]" />
            </div>
            <h1 className="font-extrabold text-lg text-[#1A3A3C] mb-2">Password berhasil diubah</h1>
            <p className="text-sm text-[#4A7A6D] leading-relaxed">
              Kamu akan diarahkan ke halaman masuk. Silakan login dengan password baru.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
