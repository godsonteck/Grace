"use client";

import { useState, useMemo } from "react";
import { scanTypes, branches, BodyPart, Invoice } from "@/lib/data";
import { useData } from "@/context/DataContext";
import {
  Plus, Search, DollarSign, X, ShoppingCart,
  ArrowRight, CreditCard, Printer, User, Activity, Wifi, WifiOff, RefreshCw, Trash2
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
      id: `INV-${Date.now()}`,
      patientName: posData.patientName,
      scanName: scan.name,
      amount: scan.price || 0,
      date: new Date().toLocaleDateString(),
      status: "unpaid",
      branchName: branch.name,
    };

    addInvoice(newInvoice);
    setIsPosModalOpen(false);
    setPosData({ patientName: "", scanId: "", branchId: branches[0].id });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* POS Header */}
      <header className="bg-secondary text-white px-8 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-2 rounded-xl">
            <ShoppingCart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">GRACE POS <span className="text-primary">v1.0</span></h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Billing Terminal</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden lg:flex items-center gap-6 border-r border-slate-700 pr-8">
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Today's Sales</p>
              <p className="text-lg font-black text-primary">${stats.todayRevenue}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Processed</p>
              <p className="text-lg font-black text-white">{stats.count}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
              {isOnline ? <Wifi className="h-3 w-3 text-green-500" /> : <WifiOff className="h-3 w-3 text-red-500" />}
              <span className="text-[10px] font-bold uppercase">{isOnline ? "Online" : "Offline"}</span>
              {isSyncing && <RefreshCw className="h-3 w-3 animate-spin text-primary ml-1" />}
            </div>
            <Link href="/admin" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Admin Dashboard</Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow p-8 flex gap-8 min-h-0">
        {/* Invoice List */}
        <div className="flex-grow flex flex-col bg-white rounded-3xl shadow-xl shadow-slate-200/50 border overflow-hidden">
          <div className="p-6 border-b bg-slate-50/50 flex justify-between items-center">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Patient name or Invoice ID..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsPosModalOpen(true)}
              className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              <Plus className="h-5 w-5" />
              New Sale (F2)
            </button>
          </div>

          <div className="flex-grow overflow-y-auto">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-8 py-4">ID</th>
                  <th className="px-8 py-4">Patient Details</th>
                  <th className="px-8 py-4">Procedure</th>
                  <th className="px-8 py-4">Amount</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-5 font-mono text-[10px] text-slate-400">{inv.id}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-secondary text-sm">{inv.patientName}</p>
                          <p className="text-[10px] text-slate-400">{inv.branchName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-medium text-slate-600">{inv.scanName}</p>
                    </td>
                    <td className="px-8 py-5 font-black text-secondary">
                      ${inv.amount}
                    </td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        inv.status === "paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      )}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {inv.status === "unpaid" && (
                          <button
                            onClick={() => payInvoice(inv.id)}
                            className="bg-green-600 text-white p-2 rounded-xl hover:bg-green-700 transition-colors shadow-sm"
                            title="Quick Pay"
                          >
                            <CreditCard className="h-4 w-4" />
                          </button>
                        )}
                        <button className="bg-slate-100 text-slate-600 p-2 rounded-xl hover:bg-slate-200 transition-colors">
                          <Printer className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="max-w-xs mx-auto">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                          <Search className="h-8 w-8" />
                        </div>
                        <p className="text-slate-500 font-medium">No sales records found.</p>
                        <p className="text-xs text-slate-400 mt-1">Try adjusting your search or create a new invoice.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Panel */}
        <div className="w-80 flex flex-col gap-6">
          <div className="bg-secondary rounded-3xl p-8 text-white shadow-xl shadow-slate-200/50">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" /> Active Summary
            </h3>
            <div className="space-y-6">
              <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Unpaid Balance</p>
                <p className="text-3xl font-black text-red-400">
                  ${invoices.filter(i => i.status === "unpaid").reduce((acc, curr) => acc + curr.amount, 0)}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">{stats.unpaid} pending invoices</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Total Sales (Today)</p>
                <p className="text-3xl font-black text-primary">${stats.todayRevenue}</p>
                <p className="text-[10px] text-slate-500 mt-1">{stats.count} completed transactions</p>
              </div>
            </div>

            <button
              onClick={() => setIsPosModalOpen(true)}
              className="w-full mt-8 bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              Start Transaction
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 border shadow-lg shadow-slate-200/50 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-3">
              <Printer className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-secondary text-sm">Receipt Printer</h4>
            <p className="text-[10px] text-slate-400 mt-1">EPSON TM-T88VI • Online</p>
          </div>
        </div>
      </main>

      {/* New Sale Modal */}
      {isPosModalOpen && (
        <div className="fixed inset-0 bg-secondary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-2xl font-black text-secondary">New Invoice</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Quick Billing Entry</p>
              </div>
              <button onClick={() => setIsPosModalOpen(false)} className="text-slate-400 hover:text-secondary bg-white p-2 rounded-2xl border shadow-sm">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCreateInvoice} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-secondary uppercase tracking-widest">Patient Name</label>
                <input
                  required
                  autoFocus
                  type="text"
                  className="w-full px-6 py-4 rounded-2xl border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none text-lg font-bold"
                  placeholder="John Doe"
                  value={posData.patientName}
                  onChange={(e) => setPosData({ ...posData, patientName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-secondary uppercase tracking-widest">Select Scan Procedure</label>
                <select
                  required
                  className="w-full px-6 py-4 rounded-2xl border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none text-lg font-bold bg-white"
                  value={posData.scanId}
                  onChange={(e) => setPosData({ ...posData, scanId: e.target.value })}
                >
                  <option value="">Choose a procedure...</option>
                  {records.map(r => (
                    <option key={r.id} value={r.id}>{r.name} (${r.price})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-secondary uppercase tracking-widest">Center Branch</label>
                <select
                  required
                  className="w-full px-6 py-4 rounded-2xl border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none font-bold bg-white"
                  value={posData.branchId}
                  onChange={(e) => setPosData({ ...posData, branchId: e.target.value })}
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-6 flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-secondary text-white py-5 rounded-[24px] font-black hover:bg-slate-800 flex items-center justify-center gap-3 transition-all shadow-xl shadow-secondary/20"
                >
                  GENERATE & PAY
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
