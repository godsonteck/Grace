"use client";

import { useState, useMemo, useEffect } from "react";
import { scanTypes, branches, BodyPart, Invoice } from "@/lib/data";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import {
  Plus, Search, DollarSign, X, ShoppingCart,
  ArrowRight, CreditCard, Printer, User, Activity, Wifi, WifiOff, RefreshCw, ChevronLeft, ShieldCheck, CheckCircle2, Lock, Key, LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function POSPage() {
  const {
    records, invoices, isOnline, isSyncing,
    addInvoice, payInvoice
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
      id: `GRC-${Math.floor(Math.random() * 100000)}`,
      patientName: posData.patientName,
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
         <div className="max-w-md w-full bg-white rounded-[50px] shadow-2xl border-4 border-primary p-12 text-center overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-[30px] flex items-center justify-center mx-auto mb-8">
               <Key className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-black text-secondary uppercase italic tracking-tighter">Terminal Locked</h2>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-2 mb-10">Shift Initialization Required</p>

            <div className="bg-slate-50 p-6 rounded-3xl mb-8 border border-slate-100">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Station</p>
               <p className="text-xl font-black text-secondary italic tracking-tighter">ACCRA-ACHIMOTA-ERP</p>
            </div>

            <button
              onClick={() => setIsShiftActive(true)}
              className="w-full bg-secondary text-white py-6 rounded-[30px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-xl active:scale-95"
            >
              Initialize Shift
              <ArrowRight className="h-4 w-4 text-primary" />
            </button>
            <button onClick={logout} className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors">Terminate Session</button>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans antialiased text-secondary animate-in fade-in duration-1000">
      {/* Dynamic Header */}
      <header className="bg-secondary text-white px-8 py-5 flex justify-between items-center shadow-2xl z-50">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="p-3 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-all group">
            <ChevronLeft className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2 italic">
              GRACE<span className="text-primary not-italic">BILLING</span>
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 italic">User: {user?.name.split(" ")[0]}</span>
              <div className="w-1 h-1 rounded-full bg-slate-700" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Terminal #04</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-12">
          <div className="hidden lg:flex items-center gap-10">
            <div className="text-right">
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1 italic">Shift Net</p>
              <p className="text-2xl font-black text-white leading-none">${stats.todayRevenue.toLocaleString()}</p>
            </div>
          </div>

          <button
            onClick={() => setIsShiftActive(false)}
            className="flex items-center gap-3 px-6 py-2.5 bg-red-500/10 border border-red-500/20 rounded-2xl hover:bg-red-500 hover:text-white transition-all group"
          >
             <Lock className="h-4 w-4 text-red-500 group-hover:text-white" />
             <span className="text-[10px] font-black uppercase tracking-widest">End Shift</span>
          </button>
        </div>
      </header>

      {/* Workspace */}
      <main className="flex-grow p-8 flex gap-8 overflow-hidden">
        {/* Main List */}
        <div className="flex-grow flex flex-col bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/50 overflow-hidden">
          <div className="p-8 border-b bg-slate-50/30 flex justify-between items-center gap-8">
            <div className="relative flex-grow max-w-2xl">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Find patient or invoice number..."
                className="w-full pl-16 pr-6 py-5 rounded-[24px] border-transparent bg-white shadow-inner focus:ring-4 focus:ring-primary/10 outline-none text-lg font-bold placeholder:text-slate-300 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsPosModalOpen(true)}
              className="bg-primary text-white px-10 py-5 rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
            >
              <Plus className="h-5 w-5" />
              New Sale
            </button>
          </div>

          <div className="flex-grow overflow-y-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-white/95 backdrop-blur-md z-10">
                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b">
                  <th className="px-10 py-6">ID</th>
                  <th className="px-10 py-6">Identity</th>
                  <th className="px-10 py-6">Procedure</th>
                  <th className="px-10 py-6 text-center">Unit Fee</th>
                  <th className="px-10 py-6">Status</th>
                  <th className="px-10 py-6 text-right">Settlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-primary/[0.02] transition-colors group">
                    <td className="px-10 py-6 font-mono text-xs font-black text-slate-400 uppercase tracking-tighter">{inv.id}</td>
                    <td className="px-10 py-6">
                      <p className="font-black text-secondary text-base italic underline decoration-primary decoration-2 underline-offset-4">{inv.patientName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{inv.branchName}</p>
                    </td>
                    <td className="px-10 py-6 font-black text-slate-500 text-xs tracking-widest uppercase">{inv.scanName}</td>
                    <td className="px-10 py-6 text-center font-black text-secondary text-xl tracking-tighter">${inv.amount}</td>
                    <td className="px-10 py-6">
                      <span className={cn(
                        "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                        inv.status === "paid" ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"
                      )}>{inv.status}</span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                        {inv.status === "unpaid" ? (
                          <button
                            onClick={() => { payInvoice(inv.id); setReceiptToPrint({...inv, status: 'paid'}); }}
                            className="bg-secondary text-white px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-colors flex items-center gap-2 shadow-lg shadow-secondary/10"
                          >
                            <CreditCard className="h-4 w-4 text-primary" /> Collect
                          </button>
                        ) : (
                          <button
                            onClick={() => setReceiptToPrint(inv)}
                            className="bg-slate-100 text-slate-600 p-2.5 rounded-2xl hover:bg-slate-200 transition-all"
                          >
                            <Printer className="h-4 w-4" />
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
        <div className="w-[400px] flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="bg-secondary rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="font-black text-xl mb-10 flex items-center gap-3 italic tracking-tighter underline decoration-primary decoration-4">
                  SESSION<span className="text-primary not-italic">KPI</span>
                </h3>
                <div className="space-y-8">
                   <div className="p-8 rounded-[35px] bg-slate-800/50 border-2 border-slate-700 italic">
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Shift Collection</p>
                      <p className="text-5xl font-black text-primary tracking-tighter">${stats.todayRevenue.toLocaleString()}</p>
                   </div>
                   <div className="p-8 rounded-[35px] bg-slate-800/50 border-2 border-slate-700 italic">
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Queue Depth</p>
                      <p className="text-5xl font-black text-red-400 tracking-tighter">{stats.unpaid}</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Receipt View (simplified logic) */}
          <div className={cn(
             "flex-grow bg-white rounded-[40px] border-4 border-slate-50 shadow-2xl p-10 flex flex-col transition-all duration-700",
             receiptToPrint ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          )}>
             <div className="flex justify-between items-center mb-10">
                <p className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] italic underline decoration-primary">Receipt Verified</p>
                <button onClick={() => setReceiptToPrint(null)}><X className="h-6 w-6 text-slate-200 hover:text-red-500" /></button>
             </div>
             {receiptToPrint && (
                <div className="flex flex-col items-center text-center space-y-6">
                   <div className="w-20 h-20 bg-green-50 text-green-500 rounded-[30px] flex items-center justify-center animate-pulse">
                      <CheckCircle2 className="h-10 w-10" />
                   </div>
                   <p className="text-2xl font-black text-secondary tracking-tighter uppercase italic">Settlement Confirmed</p>
                   <div className="w-full pt-10 border-t border-dashed space-y-4">
                      <div className="flex justify-between text-xs font-black uppercase text-slate-400 italic"><span>Patient</span> <span className="text-secondary underline decoration-slate-200">{receiptToPrint.patientName}</span></div>
                      <div className="flex justify-between text-xs font-black uppercase text-slate-400 italic"><span>Protocol</span> <span className="text-secondary">{receiptToPrint.scanName}</span></div>
                      <div className="flex justify-between text-3xl font-black text-secondary tracking-tighter pt-4 uppercase"><span>Paid</span> <span>${receiptToPrint.amount}</span></div>
                   </div>
                   <button className="w-full mt-10 bg-secondary text-white py-6 rounded-[30px] font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 hover:bg-primary transition-all italic shadow-2xl">
                      <Printer className="h-4 w-4 text-primary" /> Print Voucher
                   </button>
                </div>
             )}
          </div>
        </div>
      </main>

      {/* New Sale Modal */}
      {isPosModalOpen && (
        <div className="fixed inset-0 bg-secondary/80 backdrop-blur-3xl z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[60px] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-16 border-b bg-slate-50/50 flex justify-between items-center relative">
               <div className="relative z-10">
                  <h3 className="text-5xl font-black text-secondary tracking-tighter uppercase italic">Registry</h3>
                  <p className="text-[10px] text-primary font-black uppercase tracking-[0.5em] mt-4 italic">Billiing Entry Protocol</p>
               </div>
               <button onClick={() => setIsPosModalOpen(false)} className="p-6 bg-white rounded-[30px] shadow-xl text-slate-300 hover:text-red-500 active:scale-90 transition-all"><X className="h-10 w-10" /></button>
            </div>
            <form onSubmit={handleCreateInvoice} className="p-16 space-y-12">
               <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 italic font-black">Patient Identity</label>
                <input required autoFocus type="text" className="w-full px-10 py-8 rounded-[40px] border-2 border-slate-100 focus:border-primary outline-none text-2xl font-black italic shadow-inner" placeholder="LEGAL NAME" value={posData.patientName} onChange={(e) => setPosData({ ...posData, patientName: e.target.value })} />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 italic font-black">Procedure</label>
                <select required className="w-full px-10 py-8 rounded-[40px] border-2 border-slate-100 focus:border-primary outline-none font-black text-lg bg-slate-50/50 appearance-none italic" value={posData.scanId} onChange={(e) => setPosData({ ...posData, scanId: e.target.value })}>
                  <option value="">Select Service...</option>
                  {records.map(r => <option key={r.id} value={r.id}>{r.name} - ${r.price}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-secondary text-white py-10 rounded-[45px] font-black uppercase tracking-[0.2em] text-lg flex items-center justify-center gap-5 hover:bg-primary transition-all shadow-[0_40px_80px_rgba(0,0,0,0.15)] active:scale-95 italic">
                  GENERATE INVOICE <ArrowRight className="h-6 w-6 text-primary" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
