"use client";

import { useState, useMemo } from "react";
import { scanTypes, branches, BodyPart, Invoice } from "@/lib/data";
import { useData } from "@/context/DataContext";
import {
  LayoutDashboard, Plus, Search, Edit2, Trash2, DollarSign,
  Settings, Users, X, Save, Calendar, CheckCircle, Clock,
  Printer, CreditCard, ShoppingCart, ArrowRight, RefreshCw, Wifi, WifiOff, BarChart3, TrendingUp, Monitor
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function AdminPage() {
  const {
    records, appointments, invoices, isOnline, isSyncing,
    addRecord, updateRecord, deleteRecord,
    updateAppointment, payInvoice, syncData
  } = useData();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<BodyPart | null>(null);

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    scanTypeId: "ct-scan",
    category: "General",
    price: 0,
    duration: "20 mins",
    preparation: "No special preparation.",
  });

  const filteredRecords = useMemo(() => {
    return records.filter(part => {
      const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          part.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "All" || part.scanTypeId === filterType;
      return matchesSearch && matchesType;
    });
  }, [records, searchTerm, filterType]);

  const stats = useMemo(() => {
    const paidInvoices = invoices.filter(i => i.status === "paid");
    return {
      totalScans: records.length,
      totalValue: records.reduce((acc, curr) => acc + (curr.price || 0), 0),
      pendingAppointments: appointments.filter(a => a.status === "pending").length,
      totalRevenue: paidInvoices.reduce((acc, curr) => acc + curr.amount, 0),
      ctCount: records.filter(r => r.scanTypeId === "ct-scan").length,
      xrayCount: records.filter(r => r.scanTypeId === "xray-scan").length,
      usCount: records.filter(r => r.scanTypeId === "ultrasound-scan").length,
      ctRev: paidInvoices.filter(i => i.scanName.includes("CT")).reduce((acc, curr) => acc + curr.amount, 0),
      xrRev: paidInvoices.filter(i => i.scanName.includes("X-Ray") || i.scanName.includes("XR")).reduce((acc, curr) => acc + curr.amount, 0),
      usRev: paidInvoices.filter(i => i.scanName.includes("Ultrasound") || i.scanName.includes("US")).reduce((acc, curr) => acc + curr.amount, 0),
    };
  }, [records, appointments, invoices]);

  const handleOpenModal = (record?: BodyPart) => {
    if (record) {
      setEditingRecord(record);
      setFormData({
        name: record.name,
        scanTypeId: record.scanTypeId,
        category: record.category,
        price: record.price || 0,
        duration: record.duration || "20 mins",
        preparation: record.preparation || "No special preparation.",
      });
    } else {
      setEditingRecord(null);
      setFormData({
        name: "",
        scanTypeId: "ct-scan",
        category: "General",
        price: 0,
        duration: "20 mins",
        preparation: "No special preparation.",
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRecord) {
      updateRecord({ ...editingRecord, ...formData });
    } else {
      addRecord({ id: `custom-${Date.now()}`, ...formData });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary text-white hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            Grace Admin
          </h2>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          {[
            { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
            { id: "reports", name: "Sales Reports", icon: BarChart3 },
            { id: "appointments", name: "Appointments", icon: Calendar, badge: stats.pendingAppointments },
            { id: "body-parts", name: "Body Parts & Scans", icon: Settings },
            { id: "prices", name: "Price Management", icon: DollarSign },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors",
                activeTab === item.id ? "bg-primary text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                {item.name}
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div className="pt-4 border-t border-slate-700 mt-4">
            <Link
              href="/pos"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-primary hover:bg-primary hover:text-white transition-all font-bold"
            >
              <Monitor className="h-5 w-5" />
              Launch POS Mode
            </Link>
          </div>
        </nav>

        {/* Sync Info */}
        <div className="p-4 border-t border-slate-700 space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              {isOnline ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}
              <span className="text-xs font-bold uppercase tracking-wider">{isOnline ? "Online" : "Offline"}</span>
            </div>
            {isSyncing && <RefreshCw className="h-3 w-3 animate-spin text-primary" />}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow min-w-0">
        <header className="bg-white border-b px-8 py-6 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-secondary">
            {activeTab === "dashboard" ? "Admin Dashboard" :
             activeTab === "reports" ? "System Reports" :
             activeTab === "appointments" ? "Appointment Requests" :
             activeTab === "body-parts" ? "Manage Body Parts & Scans" : "Admin Panel"}
          </h1>
          <div className="flex gap-3">
            {isOnline && (
              <button
                onClick={() => syncData()}
                disabled={isSyncing}
                className="p-2 border rounded-lg hover:bg-slate-50 transition-colors"
                title="Force Sync"
              >
                <RefreshCw className={cn("h-5 w-5 text-slate-400", isSyncing && "animate-spin text-primary")} />
              </button>
            )}
            <button
              onClick={() => handleOpenModal()}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all"
            >
              <Plus className="h-5 w-5" />
              Add Record
            </button>
          </div>
        </header>

        <div className="p-8">
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Today's Revenue", value: `$${stats.totalRevenue}`, icon: CreditCard, color: "bg-green-500" },
                  { label: "New Requests", value: stats.pendingAppointments, icon: Calendar, color: "bg-orange-500" },
                  { label: "Inventory Items", value: stats.totalScans, icon: Settings, color: "bg-blue-500" },
                  { label: "Avg. Price", value: `$${Math.round(stats.totalValue / stats.totalScans)}`, icon: DollarSign, color: "bg-purple-500" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
                    <div className={cn("p-3 rounded-xl text-white", stat.color)}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                      <p className="text-2xl font-bold text-secondary">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl border shadow-sm overflow-hidden">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-secondary">Recent Invoice Sync</h3>
                    <Link href="/pos" className="text-xs text-primary font-bold hover:underline">View POS Terminal</Link>
                  </div>
                  <div className="space-y-4">
                    {invoices.slice(0, 5).map((inv) => (
                      <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                        <div className="flex items-center gap-4">
                          <div className={cn("p-2 rounded-lg", inv.status === "paid" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600")}>
                            <DollarSign className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-bold text-secondary text-sm">{inv.patientName}</p>
                            <p className="text-[10px] text-muted">{inv.scanName} • {inv.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-secondary text-sm">${inv.amount}</p>
                          <span className={cn("text-[8px] font-bold uppercase", inv.status === "paid" ? "text-green-600" : "text-red-600")}>{inv.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-8 rounded-2xl border shadow-sm">
                  <h3 className="text-lg font-bold text-secondary mb-6">System Status</h3>
                  <div className={cn(
                    "p-6 rounded-2xl flex items-center gap-4 border transition-all",
                    isOnline ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"
                  )}>
                    <div className={cn("p-4 rounded-full text-white", isOnline ? "bg-green-500" : "bg-red-500")}>
                      {isOnline ? <Wifi className="h-8 w-8" /> : <WifiOff className="h-8 w-8" />}
                    </div>
                    <div>
                      <p className="text-lg font-bold text-secondary">{isOnline ? "Connected" : "Working Offline"}</p>
                      <p className="text-sm text-slate-500">{isOnline ? "All systems operational. Cloud sync active." : "Local storage active. Data will sync later."}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-2xl border shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-secondary">Revenue by Scan Type</h3>
                    <p className="text-sm text-muted">Analysis based on processed payments.</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-6">
                  {[
                    { label: "CT Scans", amount: stats.ctRev, color: "bg-primary" },
                    { label: "X-Rays", amount: stats.xrRev, color: "bg-blue-400" },
                    { label: "Ultrasounds", amount: stats.usRev, color: "bg-teal-400" },
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-secondary">{item.label}</span>
                        <span className="text-secondary font-mono">${item.amount}</span>
                      </div>
                      <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all duration-1000", item.color)}
                          style={{ width: stats.totalRevenue > 0 ? `${(item.amount / stats.totalRevenue) * 100}%` : '0%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "appointments" && (
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Patient</th>
                      <th className="px-6 py-4">Scan</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {appointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-secondary">{apt.patientName}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{apt.scanName}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{apt.date}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-3 py-1 text-[10px] font-bold uppercase rounded-full",
                            apt.status === "pending" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"
                          )}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {apt.status === "pending" && (
                            <button
                              onClick={() => updateAppointment(apt.id, "confirmed")}
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "body-parts" && (
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center">
                <div className="relative w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search records..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button onClick={() => handleOpenModal()} className="bg-primary text-white px-4 py-2 rounded-lg font-bold">Add Record</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <tbody className="divide-y">
                    {filteredRecords.map((part) => (
                      <tr key={part.id}>
                        <td className="px-6 py-4 font-bold text-secondary">{part.name}</td>
                        <td className="px-6 py-4 text-slate-500">{part.category}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleOpenModal(part)} className="p-2 hover:bg-slate-100 rounded-lg"><Edit2 className="h-4 w-4" /></button>
                            <button onClick={() => deleteRecord(part.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Record Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-secondary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-secondary">
                {editingRecord ? "Edit Record" : "Add New Scan Record"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-secondary">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-secondary mb-1">Body Part Name</label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-secondary mb-1">Scan Type</label>
                  <select
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 outline-none"
                    value={formData.scanTypeId}
                    onChange={(e) => setFormData({ ...formData, scanTypeId: e.target.value })}
                  >
                    {scanTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-secondary mb-1">Base Price ($)</label>
                  <input
                    required
                    type="number"
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 outline-none"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border rounded-lg font-bold">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-bold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
