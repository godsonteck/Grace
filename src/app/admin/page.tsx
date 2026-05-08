"use client";

import { useState, useMemo, useEffect } from "react";
import { scanTypes, bodyParts as initialBodyParts, BodyPart, branches, Invoice } from "@/lib/data";
import {
  LayoutDashboard, Plus, Search, Edit2, Trash2, DollarSign,
  Settings, Users, X, Save, Calendar, CheckCircle, Clock,
  Printer, CreditCard, ShoppingCart, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

  // Data State
  const [records, setRecords] = useState<BodyPart[]>(initialBodyParts);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPosModalOpen, setIsPosModalOpen] = useState(false);
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

  const [posData, setPosData] = useState({
    patientName: "",
    scanId: "",
    branchId: branches[0].id,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedRecords = localStorage.getItem("grace_records");
    if (savedRecords) setRecords(JSON.parse(savedRecords));

    const savedApts = localStorage.getItem("grace_appointments");
    if (savedApts) setAppointments(JSON.parse(savedApts));

    const savedInvoices = localStorage.getItem("grace_invoices");
    if (savedInvoices) setInvoices(JSON.parse(savedInvoices));
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("grace_records", JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem("grace_appointments", JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem("grace_invoices", JSON.stringify(invoices));
  }, [invoices]);

  const filteredRecords = useMemo(() => {
    return records.filter(part => {
      const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          part.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "All" || part.scanTypeId === filterType;
      return matchesSearch && matchesType;
    });
  }, [records, searchTerm, filterType]);

  const stats = useMemo(() => {
    return {
      totalScans: records.length,
      totalValue: records.reduce((acc, curr) => acc + (curr.price || 0), 0),
      pendingAppointments: appointments.filter(a => a.status === "pending").length,
      totalRevenue: invoices.filter(i => i.status === "paid").reduce((acc, curr) => acc + curr.amount, 0),
      ctCount: records.filter(r => r.scanTypeId === "ct-scan").length,
      xrayCount: records.filter(r => r.scanTypeId === "xray-scan").length,
      usCount: records.filter(r => r.scanTypeId === "ultrasound-scan").length,
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
      setRecords(records.map(r => r.id === editingRecord.id ? { ...r, ...formData } : r));
    } else {
      const newRecord: BodyPart = {
        id: `custom-${Date.now()}`,
        ...formData,
      };
      setRecords([newRecord, ...records]);
    }
    setIsModalOpen(false);
  };

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

    setInvoices([newInvoice, ...invoices]);
    setIsPosModalOpen(false);
    setPosData({ patientName: "", scanId: "", branchId: branches[0].id });
    setActiveTab("pos");
  };

  const handlePayInvoice = (id: string) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: "paid" } : inv));
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
            { id: "pos", name: "POS & Billing", icon: CreditCard },
            { id: "appointments", name: "Appointments", icon: Calendar, badge: stats.pendingAppointments },
            { id: "body-parts", name: "Body Parts & Scans", icon: Settings },
            { id: "prices", name: "Price Management", icon: DollarSign },
            { id: "staff", name: "Staff Directory", icon: Users },
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
        </nav>
        <div className="p-6 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold">JD</div>
            <div>
              <p className="text-sm font-bold">John Doe</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow min-w-0">
        <header className="bg-white border-b px-8 py-6 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-secondary">
            {activeTab === "dashboard" ? "Admin Dashboard" :
             activeTab === "pos" ? "Point of Sale" :
             activeTab === "appointments" ? "Appointment Requests" :
             activeTab === "body-parts" ? "Manage Body Parts & Scans" : "Admin Panel"}
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => setIsPosModalOpen(true)}
              className="bg-secondary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-800 transition-all"
            >
              <ShoppingCart className="h-5 w-5 text-primary" />
              New Sale
            </button>
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
                <div className="bg-white p-8 rounded-2xl border shadow-sm">
                  <h3 className="text-lg font-bold text-secondary mb-6">Recent Sales</h3>
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
                    {invoices.length === 0 && <p className="text-center text-muted italic py-4">No recent sales.</p>}
                  </div>
                </div>
                <div className="bg-white p-8 rounded-2xl border shadow-sm">
                  <h3 className="text-lg font-bold text-secondary mb-6">Inventory Summary</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "CT", count: stats.ctCount, color: "text-primary" },
                      { label: "X-Ray", count: stats.xrayCount, color: "text-blue-500" },
                      { label: "U/S", count: stats.usCount, color: "text-teal-500" },
                    ].map((item, i) => (
                      <div key={i} className="text-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <p className={cn("text-2xl font-black", item.color)}>{item.count}</p>
                        <p className="text-xs text-slate-500 font-bold uppercase mt-1">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "pos" && (
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center">
                <div className="relative w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="text-sm font-bold text-secondary">
                  Total Revenue: <span className="text-green-600 text-lg">${stats.totalRevenue}</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Invoice #</th>
                      <th className="px-6 py-4">Patient & Scan</th>
                      <th className="px-6 py-4">Branch</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{inv.id}</td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-secondary">{inv.patientName}</div>
                          <div className="text-xs text-slate-400">{inv.scanName}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{inv.branchName}</td>
                        <td className="px-6 py-4 font-bold text-secondary">${inv.amount}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-3 py-1 text-[10px] font-bold uppercase rounded-full",
                            inv.status === "paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          )}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {inv.status === "unpaid" && (
                              <button
                                onClick={() => handlePayInvoice(inv.id)}
                                className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all"
                                title="Process Payment"
                              >
                                <CreditCard className="h-4 w-4" />
                              </button>
                            )}
                            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400" title="Print Receipt">
                              <Printer className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setInvoices(invoices.filter(i => i.id !== inv.id))}
                              className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {invoices.length === 0 && (
                      <tr><td colSpan={6} className="px-6 py-20 text-center text-slate-400 italic">No invoices found.</td></tr>
                    )}
                  </tbody>
                </table>
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
                      <th className="px-6 py-4">Scan & Branch</th>
                      <th className="px-6 py-4">Date & Time</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {appointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-secondary">{apt.patientName}</div>
                          <div className="text-xs text-slate-400">{apt.patientPhone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-secondary">{apt.scanName}</div>
                          <div className="text-xs text-slate-400">
                            {branches.find(b => b.id === apt.branchId)?.name || "Ho Branch"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-secondary font-medium">{apt.date}</div>
                          <div className="text-xs text-slate-400 capitalize">{apt.time} slot</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full",
                            apt.status === "pending" ? "bg-orange-100 text-orange-700" :
                            apt.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                            apt.status === "completed" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"
                          )}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {apt.status === "pending" && (
                              <button
                                onClick={() => setAppointments(appointments.map(a => a.id === apt.id ? { ...a, status: "confirmed" } : a))}
                                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => setAppointments(appointments.filter(a => a.id !== apt.id))}
                              className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
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
              <div className="p-6 border-b flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search records..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="All">All Scan Types</option>
                    {scanTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Body Part</th>
                      <th className="px-6 py-4">Scan Type</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredRecords.map((part) => (
                      <tr key={part.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-secondary">{part.name}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-accent text-primary text-xs font-bold rounded-full border border-primary/10">
                            {scanTypes.find(t => t.id === part.scanTypeId)?.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-sm">{part.category}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenModal(part)}
                              className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary transition-all"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setRecords(records.filter(r => r.id !== part.id))}
                              className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
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

      {/* POS Modal */}
      {isPosModalOpen && (
        <div className="fixed inset-0 bg-secondary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-secondary flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" /> Create New Invoice
              </h3>
              <button onClick={() => setIsPosModalOpen(false)} className="text-slate-400 hover:text-secondary">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCreateInvoice} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-secondary mb-1">Patient Name</label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 outline-none"
                  value={posData.patientName}
                  onChange={(e) => setPosData({ ...posData, patientName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-secondary mb-1">Select Scan</label>
                <select
                  required
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 outline-none"
                  value={posData.scanId}
                  onChange={(e) => setPosData({ ...posData, scanId: e.target.value })}
                >
                  <option value="">Choose a procedure...</option>
                  {records.map(r => (
                    <option key={r.id} value={r.id}>{r.name} - ${r.price}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-secondary mb-1">Branch</label>
                <select
                  required
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 outline-none"
                  value={posData.branchId}
                  onChange={(e) => setPosData({ ...posData, branchId: e.target.value })}
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsPosModalOpen(false)}
                  className="flex-1 px-4 py-2 rounded-lg border font-bold text-secondary hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg bg-secondary text-white font-bold hover:bg-slate-800 flex items-center justify-center gap-2 transition-all shadow-lg shadow-secondary/20"
                >
                  Generate Invoice
                  <ArrowRight className="h-4 w-4 text-primary" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  <label className="block text-sm font-bold text-secondary mb-1">Category</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 outline-none"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-bold text-secondary mb-1">Duration</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 outline-none"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-secondary mb-1">Preparation Instructions</label>
                <textarea
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  value={formData.preparation}
                  onChange={(e) => setFormData({ ...formData, preparation: e.target.value })}
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 rounded-lg border font-bold text-secondary hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
                >
                  <Save className="h-4 w-4" />
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
