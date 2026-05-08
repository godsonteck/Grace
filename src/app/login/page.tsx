"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate auth
    setTimeout(() => {
      localStorage.setItem("grace_auth", "true");
      router.push("/admin");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-8 bg-secondary text-white text-center">
          <Activity className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Admin Portal</h1>
          <p className="text-slate-400 text-sm mt-2">Authorized Access Only</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-secondary flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" /> Email Address
            </label>
            <input
              required
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="admin@gracediagnostic.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-secondary flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" /> Password
            </label>
            <input
              required
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            {isLoading ? "Authenticating..." : "Sign In to Dashboard"}
            {!isLoading && <ArrowRight className="h-5 w-5" />}
          </button>

          <p className="text-center text-xs text-slate-400">
            Forgot password? Contact system administrator.
          </p>
        </form>
      </div>
    </div>
  );
}
