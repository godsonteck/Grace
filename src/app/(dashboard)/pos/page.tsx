"use client";

import { useState, useMemo } from "react";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { branches, Invoice } from "@/lib/data";
import {
  Plus, X, ChevronLeft, ShieldCheck, CheckCircle2, Lock, Key, Receipt, TrendingUp, ArrowRight, CreditCard, Printer, Search, ShoppingCart
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function POSPage() {
  const {
    records, invoices, payInvoice, addInvoice
  } = useData();

  const { user, logout } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [isPosModalOpen, setIsPosModalOpen] = useState(false);
  const [receiptToPrint, setReceiptToPrint] = useState<Invoice | null>(null);
  const [isShiftActive, setIsShiftActive] = useState(false);

  // POS Form State
  const [posData, setPosData] = useState({
    patientName: "",
    scanId: "",
    branchId: branches[0].id,
  });

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv =>
      inv.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.scanName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [invoices, searchTerm]);

  const stats = useMemo(() => {
    const paidInvoices = invoices.filter(i => i.status === "paid");
    return {
      todayRevenue: paidInvoices.reduce((acc, curr) => acc + curr.amount, 0),
      count: paidInvoices.length,
      unpaid: invoices.filter(i => i.status === "unpaid").length,
    };
  }, [invoices]);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const scan = records.find(r => r.id === posData.scanId);
    const branch = branches.find(b => b.id === posData.branchId);
    if (!scan || !branch) return;

    const newInvoice: Invoice = {
      id: `GRC-${Math.floor(Math.random() * 900000) + 100000}`,
      patientName: posData.patientName.toUpperCase(),
      scanName: scan.name,
      amount: scan.price,
      date: new Date().toLocaleDateString(),
      status: "unpaid",
      branchName: branch.name,
    };

    addInvoice(newInvoice);
    setIsPosModalOpen(false);
    setPosData({ patientName: "", scanId: "", branchId: branches[0].id });
  };

  if (!isShiftActive) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-6">
         <div className="max-w-md w-full bg-white rounded-[60px] shadow-[0_50px_100px_rgba(0,0,0,0.1)] border-4 border-primary p-16 text-center overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-full h-3 bg-primary" />
            <div className="w-24 h-24 bg-primary/10 text-primary rounded-[35px] flex items-center justify-center mx-auto mb-10 group-hover:rotate-12 transition-transform duration-500">
               <Key className="h-12 w-12" />
            </div>
            <h2 className="text-4xl font-black text-secondary uppercase italic tracking-tighter">Node Locked</h2>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-4 mb-12">Shift Initialization Required</p>

            <div className="bg-slate-50 p-8 rounded-[35px] mb-10 border-2 border-slate-100 italic">
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 italic">Active Station Node</p>
               <p className="text-xl font-black text-secondary tracking-tighter">TERMINAL-ACCRA-04</p>
            </div>

            <button
              onClick={() => setIsShiftActive(true)}
              className="w-full bg-secondary text-white py-8 rounded-[35px] font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-4 hover:bg-primary transition-all shadow-2xl active:scale-95"
            >
              Initialize Node
              <ArrowRight className="h-5 w-5 text-primary" />
            </button>
            <button onClick={logout} className="mt-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-red-500 transition-colors italic">Terminate Auth session</button>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans antialiased text-secondary animate-in fade-in duration-1000">
      {/* Dynamic Header */}
      <header className="bg-secondary text-white px-10 py-6 flex justify-between items-center shadow-2xl z-50 border-b-4 border-primary/20">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="p-4 bg-slate-800 rounded-3xl hover:bg-slate-700 transition-all group border border-slate-700">
            <ChevronLeft className="h-6 w-6 text-slate-400 group-hover:text-primary transition-colors" />
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3 italic">
              GRACE<span className="text-primary not-italic">BILLING</span>
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic">Operator: {user?.name.split(" ")[0]}</span>
              <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#C8A97E]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Node active</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-16">
          <div className="hidden lg:flex items-center gap-12">
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.3em] mb-2 italic">Shift Collection</p>
              <p className="text-3xl font-black text-white leading-none tracking-tighter">${stats.todayRevenue.toLocaleString()}</p>
            </div>
            <div className="h-10 w-px bg-slate-800" />
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.3em] mb-2 italic">Queue Depth</p>
              <p className="text-3xl font-black text-primary leading-none tracking-tighter">{stats.unpaid}</p>
            </div>
          </div>

          <button
            onClick={() => setIsShiftActive(false)}
            className="flex items-center gap-4 px-8 py-4 bg-red-500/10 border-2 border-red-500/20 rounded-[25px] hover:bg-red-500 hover:text-white transition-all group shadow-lg"
          >
             <Lock className="h-5 w-5 text-red-500 group-hover:text-white" />
             <span className="text-[11px] font-black uppercase tracking-[0.2em]">Close Node</span>
          </button>
        </div>
      </header>

      {/* Workspace */}
      <main className="flex-grow p-10 flex gap-10 overflow-hidden">
        {/* Main List */}
        <div className="flex-grow flex flex-col bg-white rounded-[60px] shadow-[0_30px_100px_rgba(0,0,0,0.08)] border-4 border-white overflow-hidden relative">
          <div className="p-10 border-b bg-slate-50/50 flex justify-between items-center gap-10">
            <div className="relative flex-grow max-w-3xl">
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300" />
              <input
                type="text"
                placeholder="Lookup Identity or Voucher ID..."
                className="w-full pl-20 pr-8 py-7 rounded-[35px] border-4 border-slate-50 bg-white shadow-inner focus:ring-8 focus:ring-primary/5 focus:border-primary/20 outline-none text-2xl font-black placeholder:text-slate-200 transition-all italic tracking-tighter"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsPosModalOpen(true)}
              className="bg-primary text-white px-12 py-7 rounded-[35px] font-black uppercase tracking-[0.2em] text-xs flex items-center gap-4 hover:scale-[1.03] active:scale-95 transition-all shadow-[0_25px_50px_rgba(200,169,126,0.3)]"
            >
              <Plus className="h-6 w-6" />
              Direct Sale
            </button>
          </div>

          <div className="flex-grow overflow-y-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-white/95 backdrop-blur-md z-10">
                <tr className="text-slate-400 text-[11px] font-black uppercase tracking-[0.3em] border-b">
                  <th className="px-12 py-8">ID</th>
                  <th className="px-12 py-8">Case Identity</th>
                  <th className="px-12 py-8">Procedure Protocol</th>
                  <th className="px-12 py-8 text-center">Fee ($)</th>
                  <th className="px-12 py-8 text-right">Ops</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-primary/[0.02] transition-all group">
                    <td className="px-12 py-10 font-mono text-xs font-black text-slate-300 uppercase tracking-widest">{inv.id}</td>
                    <td className="px-12 py-10">
                      <p className="font-black text-secondary text-lg italic underline decoration-primary decoration-4 underline-offset-[6px] group-hover:text-primary transition-colors">{inv.patientName}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-3">{inv.branchName}</p>
                    </td>
                    <td className="px-12 py-10">
                       <span className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">{inv.scanName}</span>
                    </td>
                    <td className="px-12 py-10 text-center font-black text-secondary text-2xl tracking-tighter italic">${inv.amount.toLocaleString()}</td>
                    <td className="px-12 py-10 text-right">
                      <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-8 group-hover:translate-x-0">
                        {inv.status === "unpaid" ? (
                          <button
                            onClick={() => { payInvoice(inv.id); setReceiptToPrint({...inv, status: 'paid'}); }}
                            className="bg-secondary text-white px-8 py-4 rounded-[25px] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-primary transition-all flex items-center gap-3 shadow-2xl active:scale-90"
                          >
                            <CreditCard className="h-5 w-5 text-primary" /> Settlement
                          </button>
                        ) : (
                          <button
                            onClick={() => setReceiptToPrint(inv)}
                            className="bg-slate-100 text-slate-400 p-4 rounded-2xl hover:bg-secondary hover:text-white transition-all shadow-sm"
                          >
                            <Printer className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-[450px] flex flex-col gap-10 animate-in fade-in slide-in-from-right-10 duration-700">
          <div className="bg-secondary rounded-[55px] p-12 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-16 opacity-5 rotate-45 group-hover:rotate-0 transition-transform duration-1000 scale-150"><Receipt className="h-60 w-60" /></div>
             <div className="relative z-10">
                <h3 className="font-black text-2xl mb-12 flex items-center gap-4 italic tracking-tighter underline decoration-primary decoration-8 underline-offset-8">
                  SESSION<span className="text-primary not-italic">INTEL</span>
                </h3>
                <div className="space-y-10">
                   <div className="p-10 rounded-[45px] bg-slate-800/40 border-2 border-slate-700/50 italic shadow-inner">
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-3 italic">Node Yield Today</p>
                      <p className="text-6xl font-black text-primary tracking-tighter">${stats.todayRevenue.toLocaleString()}</p>
                   </div>
                   <div className="p-10 rounded-[45px] bg-slate-800/40 border-2 border-slate-700/50 italic shadow-inner flex justify-between items-center">
                      <div>
                         <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-3 italic">Active Pipeline</p>
                         <p className="text-6xl font-black text-red-400 tracking-tighter">{stats.unpaid}</p>
                      </div>
                      <TrendingUp className="h-12 w-12 text-slate-700" />
                   </div>
                </div>
             </div>
          </div>

          {/* Receipt View */}
          <div className={cn(
             "flex-grow bg-white rounded-[55px] border-[6px] border-slate-50 shadow-[0_40px_100px_rgba(0,0,0,0.15)] p-12 flex flex-col transition-all duration-1000",
             receiptToPrint ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12 pointer-events-none"
          )}>
             <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <p className="text-[10px] font-black text-secondary uppercase tracking-[0.4em] italic">Voucher Authenticated</p>
                </div>
                <button onClick={() => setReceiptToPrint(null)} className="p-3 bg-slate-50 rounded-xl text-slate-200 hover:text-red-500 transition-all"><X className="h-6 w-6" /></button>
             </div>
             {receiptToPrint && (
                <div className="flex flex-col items-center text-center space-y-8 flex-grow">
                   <div className="w-24 h-24 bg-green-50 text-green-500 rounded-[40px] flex items-center justify-center shadow-xl shadow-green-500/10 scale-110">
                      <CheckCircle2 className="h-12 w-12" />
                   </div>
                   <div>
                      <p className="text-3xl font-black text-secondary tracking-tighter uppercase italic">Settlement Confirmed</p>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] mt-2">Authorization Complete</p>
                   </div>
                   <div className="w-full pt-12 border-t-2 border-dashed border-slate-100 space-y-6">
                      <div className="flex justify-between text-xs font-black uppercase text-slate-400 italic tracking-widest"><span>Patient Case</span> <span className="text-secondary underline decoration-primary decoration-2">{receiptToPrint.patientName}</span></div>
                      <div className="flex justify-between text-xs font-black uppercase text-slate-400 italic tracking-widest"><span>Service Node</span> <span className="text-secondary">{receiptToPrint.scanName}</span></div>
                      <div className="flex justify-between text-xs font-black uppercase text-slate-400 italic tracking-widest"><span>Voucher ID</span> <span className="text-slate-300 font-mono">{receiptToPrint.id}</span></div>
                      <div className="flex justify-between text-4xl font-black text-secondary tracking-tighter pt-8 uppercase italic underline decoration-primary decoration-8 underline-offset-8"><span>Total</span> <span>${receiptToPrint.amount.toLocaleString()}</span></div>
                   </div>
                   <button className="w-full mt-auto bg-secondary text-white py-8 rounded-[40px] font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-5 hover:bg-primary transition-all italic shadow-2xl active:scale-95">
                      <Printer className="h-5 w-5 text-primary" /> Execute hardcopy
                   </button>
                </div>
             )}
          </div>
        </div>
      </main>

      {/* New Sale Modal */}
      {isPosModalOpen && (
        <div className="fixed inset-0 bg-secondary/95 backdrop-blur-3xl z-[100] flex items-center justify-center p-8">
          <div className="bg-white rounded-[80px] shadow-[0_100px_200px_rgba(0,0,0,0.5)] w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-500 border-[10px] border-white/50 relative">
            <div className="absolute top-0 right-0 p-20 opacity-5 scale-150 rotate-45 pointer-events-none"><ShoppingCart className="h-60 w-60 text-primary" /></div>
            <div className="p-20 border-b bg-slate-50/50 flex justify-between items-center relative z-10">
               <div>
                  <h3 className="text-6xl font-black text-secondary tracking-tighter uppercase italic underline decoration-primary decoration-[12px] underline-offset-[12px]">Voucher</h3>
                  <p className="text-[11px] text-primary font-black uppercase tracking-[0.8em] mt-10 ml-4 italic">Internal Settlement Protocol</p>
               </div>
               <button onClick={() => setIsPosModalOpen(false)} className="p-10 bg-white rounded-[45px] shadow-2xl text-slate-200 hover:text-red-500 active:scale-75 transition-all border-2 border-slate-50"><X className="h-14 w-14" /></button>
            </div>
            <form onSubmit={handleCreateInvoice} className="p-20 space-y-16 relative z-10">
               <div className="space-y-6">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] ml-8 italic">Patient Legal Identity</label>
                <input required autoFocus type="text" className="w-full px-12 py-10 rounded-[50px] border-4 border-slate-50 bg-slate-50/30 focus:border-primary focus:bg-white outline-none text-4xl font-black italic shadow-inner tracking-tighter transition-all" placeholder="EX: KOFI OSEI" value={posData.patientName} onChange={(e) => setPosData({ ...posData, patientName: e.target.value })} />
              </div>
              <div className="space-y-6">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] ml-8 italic">Clinical Protocol Selection</label>
                <select required className="w-full px-12 py-10 rounded-[50px] border-4 border-slate-50 focus:border-primary outline-none font-black text-2xl bg-white appearance-none italic shadow-xl tracking-tighter transition-all" value={posData.scanId} onChange={(e) => setPosData({ ...posData, scanId: e.target.value })}>
                  <option value="">SELECT SERVICE...</option>
                  {records.map(r => <option key={r.id} value={r.id}>{r.name.toUpperCase()} (${r.price.toLocaleString()})</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-secondary text-white py-12 rounded-[60px] font-black uppercase tracking-[0.4em] text-2xl flex items-center justify-center gap-8 hover:bg-primary transition-all shadow-[0_50px_100px_rgba(0,0,0,0.3)] active:scale-95 italic">
                  AUTHORIZE VOUCHER <ArrowRight className="h-8 w-8 text-primary" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
