"use client";

import { useState, useMemo } from "react";
import { scanTypes, branches, BodyPart, Invoice } from "@/lib/data";
import { useData } from "@/context/DataContext";
import {
  Plus, Search, DollarSign, X, ShoppingCart,
  ArrowRight, CreditCard, Printer, User, Activity, Wifi, WifiOff, RefreshCw, ChevronLeft, ShieldCheck, CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function POSPage() {
  const {
    records, invoices, isOnline, isSyncing,
    addInvoice, payInvoice
  } = useData();

  const [searchTerm, setSearchTerm] = useState("");
  const [isPosModalOpen, setIsPosModalOpen] = useState(false);
  const [receiptToPrint, setReceiptToPrint] = useState<Invoice | null>(null);

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

  const processPayment = (inv: Invoice) => {
    payInvoice(inv.id);
    setReceiptToPrint({ ...inv, status: "paid" });
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans antialiased text-secondary">
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
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Terminal ID: 8820-X</span>
              <div className="w-1 h-1 rounded-full bg-slate-700" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">{branches[0].name.split("-")[1]}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-12">
          <div className="hidden lg:flex items-center gap-10">
            <div className="text-right">
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Session Volume</p>
              <p className="text-2xl font-black text-white leading-none">${stats.todayRevenue.toLocaleString()}</p>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-right">
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Queue Status</p>
              <p className="text-2xl font-black text-primary leading-none">{stats.unpaid}</p>
            </div>
          </div>

          <div className={cn(
            "flex items-center gap-3 px-4 py-2 rounded-2xl border transition-all duration-500",
            isOnline ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"
          )}>
            <div className={cn("w-2 h-2 rounded-full", isOnline ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-red-500 shadow-[0_0_8px_#ef4444]")} />
            <span className="text-[10px] font-black uppercase tracking-widest">{isOnline ? "Server Link: Active" : "Local: Offline"}</span>
            {isSyncing && <RefreshCw className="h-3 w-3 animate-spin text-primary" />}
          </div>
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
                  <th className="px-10 py-6">Voucher ID</th>
                  <th className="px-10 py-6">Patient</th>
                  <th className="px-10 py-6">Procedure</th>
                  <th className="px-10 py-6 text-center">Fee</th>
                  <th className="px-10 py-6">Status</th>
                  <th className="px-10 py-6 text-right">Settlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-primary/[0.02] transition-colors group">
                    <td className="px-10 py-6 font-mono text-xs font-black text-slate-400 uppercase tracking-tighter">{inv.id}</td>
                    <td className="px-10 py-6">
                      <p className="font-black text-secondary text-base">{inv.patientName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{inv.branchName}</p>
                    </td>
                    <td className="px-10 py-6 font-bold text-slate-500 text-sm">{inv.scanName}</td>
                    <td className="px-10 py-6 text-center font-black text-secondary text-lg">${inv.amount}</td>
                    <td className="px-10 py-6">
                      <span className={cn(
                        "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                        inv.status === "paid" ? "bg-green-500/10 text-green-600 border border-green-500/20" : "bg-red-500/10 text-red-600 border border-red-500/20"
                      )}>{inv.status}</span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                        {inv.status === "unpaid" ? (
                          <button
                            onClick={() => processPayment(inv)}
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
        <div className="w-[400px] flex flex-col gap-8">
          {/* Quick Stats */}
          <div className="bg-secondary rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
               <ShieldCheck className="h-40 w-40" />
            </div>
            <div className="relative z-10">
              <h3 className="font-black text-xl mb-10 flex items-center gap-3 italic tracking-tighter">
                <Activity className="h-6 w-6 text-primary not-italic" /> SESSION<span className="text-primary not-italic">KPI</span>
              </h3>
              <div className="space-y-8">
                <div className="flex justify-between items-end border-b border-slate-800 pb-6">
                  <div>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Awaiting Payment</p>
                    <p className="text-4xl font-black text-red-400 tracking-tighter">
                      ${invoices.filter(i => i.status === "unpaid").reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-400 leading-none">{stats.unpaid}</p>
                    <p className="text-[8px] text-slate-600 font-black uppercase mt-1">Files</p>
                  </div>
                </div>
                <div>
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Collection Today</p>
                   <p className="text-5xl font-black text-primary tracking-tighter">
                      ${stats.todayRevenue.toLocaleString()}
                   </p>
                   <div className="flex items-center gap-2 mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {stats.count} Successful Settlements
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Receipt Preview Component */}
          <div className={cn(
            "flex-grow bg-white rounded-[40px] border shadow-2xl p-8 flex flex-col transition-all duration-700",
            receiptToPrint ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
          )}>
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-dashed">
               <p className="text-xs font-black text-secondary uppercase tracking-[0.2em]">Settlement View</p>
               <button onClick={() => setReceiptToPrint(null)}><X className="h-5 w-5 text-slate-300 hover:text-red-500" /></button>
            </div>

            {receiptToPrint && (
              <div className="space-y-6 flex-grow flex flex-col items-center text-center">
                 <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center animate-bounce">
                    <CheckCircle2 className="h-8 w-8" />
                 </div>
                 <div>
                    <p className="text-2xl font-black text-secondary tracking-tighter uppercase italic">Grace Receipt</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Transaction Verified</p>
                 </div>

                 <div className="w-full space-y-4 pt-6 text-sm">
                    <div className="flex justify-between font-medium text-slate-500">
                       <span>Patient:</span>
                       <span className="font-bold text-secondary">{receiptToPrint.patientName}</span>
                    </div>
                    <div className="flex justify-between font-medium text-slate-500">
                       <span>Service:</span>
                       <span className="font-bold text-secondary">{receiptToPrint.scanName}</span>
                    </div>
                    <div className="flex justify-between font-medium text-slate-500">
                       <span>Reference:</span>
                       <span className="font-mono text-xs font-bold text-secondary">{receiptToPrint.id}</span>
                    </div>
                    <div className="h-px w-full border-t border-dashed my-4" />
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-black uppercase text-slate-400">Total Paid</span>
                       <span className="text-3xl font-black text-secondary italic">${receiptToPrint.amount}</span>
                    </div>
                 </div>

                 <button className="w-full mt-auto bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-3xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all">
                    <Printer className="h-4 w-4" />
                    Print Hardcopy
                 </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* New Sale Modal */}
      {isPosModalOpen && (
        <div className="fixed inset-0 bg-secondary/60 backdrop-blur-lg z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[50px] shadow-[0_50px_100px_rgba(0,0,0,0.3)] w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-12 border-b flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-4xl font-black text-secondary tracking-tighter uppercase italic">Voucher</h3>
                <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mt-2">Immediate Diagnostic Settlement</p>
              </div>
              <button onClick={() => setIsPosModalOpen(false)} className="text-slate-300 hover:text-red-500 transition-colors p-4">
                <X className="h-8 w-8" />
              </button>
            </div>
            <form onSubmit={handleCreateInvoice} className="p-12 space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Patient Legal Name</label>
                <input
                  required
                  autoFocus
                  type="text"
                  className="w-full px-8 py-6 rounded-[30px] border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none text-2xl font-black placeholder:text-slate-100 transition-all shadow-sm"
                  placeholder="EX: JOHN KWAME OSEI"
                  value={posData.patientName}
                  onChange={(e) => setPosData({ ...posData, patientName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Clinical Procedure</label>
                  <select
                    required
                    className="w-full px-8 py-6 rounded-[30px] border-2 border-slate-100 focus:border-primary outline-none font-black bg-white shadow-sm appearance-none text-sm"
                    value={posData.scanId}
                    onChange={(e) => setPosData({ ...posData, scanId: e.target.value })}
                  >
                    <option value="">Select Service...</option>
                    {records.map(r => (
                      <option key={r.id} value={r.id}>{r.name} (${r.price})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Assigned Branch</label>
                  <select
                    required
                    className="w-full px-8 py-6 rounded-[30px] border-2 border-slate-100 focus:border-primary outline-none font-black bg-white shadow-sm appearance-none text-sm"
                    value={posData.branchId}
                    onChange={(e) => setPosData({ ...posData, branchId: e.target.value })}
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name.split("-")[1]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-8">
                <button
                  type="submit"
                  className="w-full bg-secondary text-white py-8 rounded-[35px] font-black text-lg tracking-[0.1em] uppercase hover:bg-primary transition-all shadow-[0_20px_40px_rgba(0,0,0,0.1)] flex items-center justify-center gap-4 active:scale-95"
                >
                  Confirm & Finalize
                  <ArrowRight className="h-6 w-6 text-primary" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
