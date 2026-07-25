"use client";

import { useMemo } from "react";
import { useData } from "@/context/DataContext";
import { scanTypes } from "@/lib/data";
import {
  TrendingUp, Users, Activity,
  ArrowUpRight, ArrowDownRight, Microscope, Beaker,
  PieChart, Calendar, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  const { appointments, invoices } = useData();

  const metrics = useMemo(() => {
    const totalApts = appointments.length;
    const completedApts = appointments.filter(a => a.reportAttached).length;
    const pendingApts = totalApts - completedApts;
    const totalRev = invoices.filter(i => i.status === "paid").reduce((acc, curr) => acc + curr.amount, 0);

    // Scan distribution
    const scanDist = scanTypes.map(type => ({
      name: type.name,
      count: appointments.filter(a => a.scanName.includes(type.name)).length,
      rev: invoices.filter(i => i.scanName.includes(type.name) && i.status === "paid").reduce((acc, curr) => acc + curr.amount, 0)
    }));

    return { totalApts, completedApts, pendingApts, totalRev, scanDist };
  }, [appointments, invoices]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex justify-between items-end mb-16">
          <div>
            <h1 className="text-5xl font-black text-secondary tracking-tighter uppercase italic underline decoration-primary decoration-8 underline-offset-8">Clinical Analytics</h1>
            <p className="text-slate-400 text-lg mt-8 font-medium italic">Synthesizing diagnostic volume and financial intelligence across the node network.</p>
          </div>
          <div className="flex gap-4">
             <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 italic font-black text-[10px] uppercase tracking-widest text-slate-400">
                <Calendar className="h-4 w-4 text-primary" /> Q4 2024 REGISTRY
             </div>
          </div>
        </header>

        {/* High Level Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {[
             { label: "Aggregate Throughput", value: metrics.totalApts, trend: "+12.5%", up: true, icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
             { label: "Clinical Yield (GH₵)", value: `GH₵${metrics.totalRev.toLocaleString()}`, trend: "+8.2%", up: true, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
             { label: "Verification Velocity", value: "0.8h", trend: "-15%", up: false, icon: Zap, color: "text-purple-600", bg: "bg-purple-50" },
             { label: "Active Cohort", value: metrics.pendingApts, trend: "Stable", up: true, icon: Users, color: "text-orange-600", bg: "bg-orange-50" },
           ].map((stat, i) => (
             <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm border-2 border-slate-50 group hover:border-primary transition-all">
                <div className="flex justify-between items-start mb-8">
                   <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner", stat.bg, stat.color)}>
                      <stat.icon className="h-7 w-7" />
                   </div>
                   <div className={cn("flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black italic tracking-widest", stat.up ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600")}>
                      {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {stat.trend}
                   </div>
                </div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2 italic">{stat.label}</p>
                <p className="text-4xl font-black text-secondary tracking-tighter italic">{stat.value}</p>
             </div>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           {/* Modality Performance */}
           <div className="bg-white p-12 rounded-[50px] shadow-2xl border-4 border-white">
              <div className="flex justify-between items-center mb-12">
                 <h3 className="text-2xl font-black text-secondary tracking-tighter uppercase italic flex items-center gap-3"><PieChart className="h-6 w-6 text-primary" /> Modality Yield</h3>
              </div>
              <div className="space-y-8">
                 {metrics.scanDist.filter(s => s.count > 0).map((s, i) => (
                   <div key={i} className="space-y-4">
                      <div className="flex justify-between items-end">
                         <div>
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 italic mb-1">{s.name}</p>
                            <p className="text-lg font-black text-secondary italic tracking-tighter underline decoration-primary decoration-2 underline-offset-4">{s.count} PROCEDURES</p>
                         </div>
                         <p className="text-2xl font-black text-primary italic tracking-tighter">GH₵{s.rev.toLocaleString()}</p>
                      </div>
                      <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                         <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: metrics.totalRev > 0 ? `${(s.rev / metrics.totalRev) * 100}%` : '0%' }} />
                      </div>
                   </div>
                 ))}
                 {metrics.scanDist.filter(s => s.count > 0).length === 0 && <p className="py-20 text-center text-slate-400 italic font-black uppercase tracking-widest">No modality data available</p>}
              </div>
           </div>

           {/* Throughput Analytics */}
           <div className="bg-secondary p-12 rounded-[50px] text-white shadow-2xl relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none italic font-black text-8xl leading-none">VECTORS</div>
              <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-12 flex items-center gap-3 underline decoration-primary decoration-4">Infrastructure Health <Activity className="h-6 w-6 text-primary" /></h3>

              <div className="flex-grow flex flex-col justify-center items-center text-center space-y-10">
                 <div className="relative">
                    <div className="w-48 h-48 rounded-full border-8 border-primary border-t-transparent animate-spin duration-[3000ms]" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <p className="text-4xl font-black italic tracking-tighter">98.4%</p>
                       <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Efficiency</p>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-8 w-full max-w-sm">
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-center">
                       <Microscope className="h-6 w-6 text-primary mx-auto mb-3" />
                       <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Imaging Nodes</p>
                       <p className="text-xl font-black italic tracking-tighter">OPERATIONAL</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-center">
                       <Beaker className="h-6 w-6 text-blue-400 mx-auto mb-3" />
                       <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Lab Sync</p>
                       <p className="text-xl font-black italic tracking-tighter text-blue-400">SYNCHRONIZED</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
