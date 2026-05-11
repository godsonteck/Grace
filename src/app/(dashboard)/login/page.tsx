"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
  ShieldAlert, Monitor, LayoutDashboard, Lock, Activity, Stethoscope
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'CASHIER' | 'RADIOLOGIST' | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    // Simulated credential check
    if (username === selectedRole.toLowerCase() && password === selectedRole.toLowerCase()) {
      login(selectedRole);
    } else {
      alert("Invalid clinical credentials for this sector.");
    }
  };

  const options = [
    {
      role: 'ADMIN' as const,
      title: 'Executive Admin',
      desc: 'Full ERP & Financial Control',
      icon: LayoutDashboard,
      color: 'bg-secondary',
      accent: 'text-primary'
    },
    {
      role: 'CASHIER' as const,
      title: 'Billing Terminal',
      desc: 'Point of Sale & Payments',
      icon: Monitor,
      color: 'bg-primary',
      accent: 'text-white'
    },
    {
      role: 'RADIOLOGIST' as const,
      title: 'Clinical Portal',
      desc: 'Radiology Results & EHR',
      icon: Stethoscope,
      color: 'bg-blue-600',
      accent: 'text-white'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-6 py-20">
      <div className="max-w-6xl w-full flex flex-col gap-12">
        <div className="text-center space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200">
              <ShieldAlert className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Security Gate • Authenticated Access Only</span>
           </div>
           <h1 className="text-5xl font-black text-secondary tracking-tighter uppercase italic">
              Grace<span className="text-primary not-italic">Diagnostic</span>
           </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {options.map((opt) => (
            <div
              key={opt.role}
              onClick={() => setSelectedRole(opt.role)}
              className={cn(
                "bg-white rounded-[50px] border-4 transition-all duration-500 group overflow-hidden shadow-2xl cursor-pointer",
                selectedRole === opt.role ? "border-primary scale-105" : "border-transparent hover:border-slate-200"
              )}
            >
              <div className={cn("p-12 text-center", opt.color)}>
                 <div className="w-20 h-20 bg-white/10 rounded-[30px] flex items-center justify-center mx-auto mb-8 group-hover:rotate-12 transition-transform duration-500">
                    <opt.icon className="h-10 w-10 text-white" />
                 </div>
                 <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">{opt.title}</h2>
                 <p className="text-white/60 font-bold mt-2 text-sm uppercase tracking-widest">{opt.desc}</p>
              </div>
              <div className="p-10 text-center">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Sector Access Module</p>
              </div>
            </div>
          ))}
        </div>

        {selectedRole && (
          <div className="max-w-md mx-auto w-full bg-white p-12 rounded-[50px] shadow-2xl border-4 border-slate-50 animate-in fade-in slide-in-from-bottom-8">
             <form onSubmit={handleLogin} className="space-y-8">
                <div className="text-center mb-8">
                   <Lock className="h-10 w-10 text-primary mx-auto mb-4" />
                   <h3 className="text-2xl font-black text-secondary tracking-tighter uppercase italic">Sector Verification</h3>
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2 italic">Role: {selectedRole}</p>
                </div>
                <div className="space-y-4">
                   <input
                     required
                     type="text"
                     placeholder="USERNAME"
                     className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary outline-none font-black text-xs tracking-widest transition-all italic"
                     value={username}
                     onChange={e => setUsername(e.target.value)}
                   />
                   <input
                     required
                     type="password"
                     placeholder="PASSWORD"
                     className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary outline-none font-black text-xs tracking-widest transition-all italic"
                     value={password}
                     onChange={e => setPassword(e.target.value)}
                   />
                </div>
                <button
                  type="submit"
                  className="w-full py-6 rounded-3xl bg-secondary text-white font-black uppercase tracking-widest text-xs hover:bg-primary transition-all shadow-xl active:scale-95 italic"
                >
                  Authorize Connection
                </button>
                <p className="text-center text-[9px] text-slate-300 font-bold italic uppercase">Demo Tip: Use role name for both fields (e.g. admin/admin)</p>
             </form>
          </div>
        )}

        <div className="flex justify-center items-center gap-8 text-slate-400">
           <p className="text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2">
              <Activity className="h-4 w-4" /> Global Node: Achimota-1
           </p>
           <div className="h-4 w-px bg-slate-300" />
           <p className="text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2">
              System Encrypted 256-Bit
           </p>
        </div>
      </div>
    </div>
  );
}
