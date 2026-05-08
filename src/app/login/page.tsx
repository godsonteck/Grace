"use client";

import { useAuth } from "@/context/AuthContext";
import {
  ArrowRight, ShieldAlert, Monitor, LayoutDashboard, Microscope, LogOut, Activity
} from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();

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
      icon: Microscope,
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
            <div key={opt.role} className="bg-white rounded-[50px] border-4 border-transparent hover:border-primary transition-all duration-500 group overflow-hidden shadow-2xl">
              <div className={cn("p-12 text-center", opt.color)}>
                 <div className="w-20 h-20 bg-white/10 rounded-[30px] flex items-center justify-center mx-auto mb-8 group-hover:rotate-12 transition-transform duration-500">
                    <opt.icon className="h-10 w-10 text-white" />
                 </div>
                 <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">{opt.title}</h2>
                 <p className="text-white/60 font-bold mt-2 text-sm uppercase tracking-widest">{opt.desc}</p>
              </div>
              <div className="p-10">
                 <button
                   onClick={() => login(opt.role)}
                   className="w-full py-6 rounded-[30px] bg-slate-50 hover:bg-secondary hover:text-white transition-all duration-300 font-black uppercase tracking-[0.1em] text-xs flex items-center justify-center gap-3 border border-slate-100"
                 >
                   Establish Session
                   <ArrowRight className="h-4 w-4" />
                 </button>
              </div>
            </div>
          ))}
        </div>

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

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
