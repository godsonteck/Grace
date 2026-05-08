"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, Lock, Mail, ArrowRight, ShoppingCart, LayoutDashboard } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (target: string) => {
    setIsLoading(true);
    // Simulate auth
    setTimeout(() => {
      localStorage.setItem("grace_auth", "true");
      router.push(target);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Admin Login */}
        <div className="bg-white rounded-[40px] border shadow-xl shadow-slate-200/50 overflow-hidden group hover:border-primary transition-all">
          <div className="p-12 text-center border-b bg-slate-50 group-hover:bg-primary/5 transition-colors">
            <div className="w-20 h-20 bg-secondary text-white rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3 group-hover:rotate-0 transition-transform">
              <LayoutDashboard className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-3xl font-black text-secondary">Administrator</h2>
            <p className="text-slate-500 font-bold mt-2">Management & Reports</p>
          </div>
          <div className="p-12">
            <button
              onClick={() => handleLogin("/admin")}
              className="w-full bg-secondary text-white py-5 rounded-3xl font-black flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-secondary/20"
            >
              ACCESS DASHBOARD
              <ArrowRight className="h-6 w-6 text-primary" />
            </button>
          </div>
        </div>

        {/* POS Login */}
        <div className="bg-white rounded-[40px] border shadow-xl shadow-slate-200/50 overflow-hidden group hover:border-primary transition-all">
          <div className="p-12 text-center border-b bg-slate-50 group-hover:bg-primary/5 transition-colors">
            <div className="w-20 h-20 bg-primary text-white rounded-3xl flex items-center justify-center mx-auto mb-6 -rotate-3 group-hover:rotate-0 transition-transform">
              <ShoppingCart className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-black text-secondary">Billing Staff</h2>
            <p className="text-slate-500 font-bold mt-2">POS & Cashier Terminal</p>
          </div>
          <div className="p-12">
            <button
              onClick={() => handleLogin("/pos")}
              className="w-full bg-primary text-white py-5 rounded-3xl font-black flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
            >
              LAUNCH POS SYSTEM
              <ArrowRight className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
