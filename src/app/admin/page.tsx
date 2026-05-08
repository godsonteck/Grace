"use client";

import { useState, useMemo } from "react";
import { scanTypes, branches, BodyPart, Invoice, Staff, Equipment, Appointment } from "@/lib/data";
import { useData } from "@/context/DataContext";
import {
  LayoutDashboard, Plus, Search, Edit2, Trash2, DollarSign,
  Settings, Users, X, Save, Calendar, CheckCircle, Clock,
  Printer, CreditCard, ShoppingCart, ArrowRight, RefreshCw, Wifi, WifiOff, BarChart3, TrendingUp, Monitor, HardDrive, ShieldCheck, ClipboardList, Briefcase, UserPlus, FileText, Activity, AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function AdminPage() {
  const {
    records, appointments, invoices, staff, equipment, auditLogs, isOnline, isSyncing,
    addRecord, updateRecord, deleteRecord,
    updateAppointment, attachReport, addStaff, updateStaff, updateEquipment, syncData
  } = useData();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"record" | "staff" | "equipment" | "appointment">("record");
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Form States
  const [recordForm, setRecordRecordForm] = useState({ name: "", scanTypeId: "ct-scan", category: "General", price: 0, duration: "20 mins", preparation: "" });
  const [staffForm, setStaffForm] = useState<Staff>({ id: "", name: "", role: "Radiologist", branchId: branches[0].id, phone: "", email: "", status: "active" });
  const [equipForm, setEquipForm] = useState<Equipment>({ id: "", name: "", type: "CT Scanner", branchId: branches[0].id, lastMaintenance: "", status: "operational" });

  const stats = useMemo(() => {
    const paidInvoices = invoices.filter(i => i.status === "paid");
    return {
      totalScans: records.length,
      pendingAppointments: appointments.filter(a => a.status === "pending").length,
      totalRevenue: paidInvoices.reduce((acc, curr) => acc + curr.amount, 0),
      staffCount: staff.length,
      equipmentAlerts: equipment.filter(e => e.status !== "operational").length,
      ctRev: paidInvoices.filter(i => i.scanName.toLowerCase().includes("ct")).reduce((acc, curr) => acc + curr.amount, 0),
      xrRev: paidInvoices.filter(i => i.scanName.toLowerCase().includes("x-ray") || i.scanName.toLowerCase().includes("xr")).reduce((acc, curr) => acc + curr.amount, 0),
      usRev: paidInvoices.filter(i => i.scanName.toLowerCase().includes("ultrasound") || i.scanName.toLowerCase().includes("us")).reduce((acc, curr) => acc + curr.amount, 0),
      branchBreakdown: branches.map(b => ({
        name: b.name.split("-")[1].trim(),
        rev: paidInvoices.filter(i => i.branchName === b.name).reduce((acc, curr) => acc + curr.amount, 0)
      }))
    };
  }, [records, appointments, invoices, staff, equipment]);

  const handleOpenRecordModal = (record?: BodyPart) => {
    setModalType("record");
    if (record) {
      setEditingItem(record);
      setRecordRecordForm({ ...record });
    } else {
      setEditingItem(null);
      setRecordRecordForm({ name: "", scanTypeId: "ct-scan", category: "General", price: 0, duration: "20 mins", preparation: "" });
    }
    setIsModalOpen(true);
  };

  const handleOpenStaffModal = (member?: Staff) => {
    setModalType("staff");
    if (member) {
      setEditingItem(member);
      setStaffForm({ ...member });
    } else {
      setEditingItem(null);
      setStaffForm({ id: `st-${Date.now()}`, name: "", role: "Radiologist", branchId: branches[0].id, phone: "", email: "", status: "active" });
    }
    setIsModalOpen(true);
  };

  const handleOpenEquipModal = (item?: Equipment) => {
    setModalType("equipment");
    if (item) {
      setEditingItem(item);
      setEquipForm({ ...item });
    } else {
      setEditingItem(null);
      setEquipForm({ id: `eq-${Date.now()}`, name: "", type: "CT Scanner", branchId: branches[0].id, lastMaintenance: new Date().toISOString().split('T')[0], status: "operational" });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === "record") {
      editingItem ? updateRecord({ ...editingItem, ...recordForm }) : addRecord({ id: `rc-${Date.now()}`, ...recordForm });
    } else if (modalType === "staff") {
      editingItem ? updateStaff({ ...staffForm }) : addStaff(staffForm);
    } else if (modalType === "equipment") {
      editingItem ? updateEquipment(equipForm) : updateEquipment(equipForm); // Simple for now
    }
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-secondary">
      {/* Sidebar */}
      <aside className="w-72 bg-secondary text-white hidden md:flex flex-col sticky top-0 h-screen shadow-2xl">
        <div className="p-8 border-b border-slate-800">
          <div className="flex items-center gap-3">
             <div className="bg-primary p-2 rounded-xl rotate-3">
                <ShieldCheck className="h-6 w-6 text-white" />
             </div>
             <div>
                <h2 className="text-xl font-black tracking-tighter">GRACE<span className="text-primary italic">CORE</span></h2>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Enterprise ERP v4.0</p>
             </div>
          </div>
        </div>

        <nav className="flex-grow p-6 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 ml-2">Executive</p>
          {[
            { id: "dashboard", name: "Executive Suite", icon: LayoutDashboard },
            { id: "reports", name: "Financial Intel", icon: BarChart3 },
            { id: "logs", name: "Security Audits", icon: ClipboardList },
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={cn(
                "w-full flex items-center gap-4 px-5 py-4 rounded-[20px] transition-all duration-300",
                activeTab === item.id ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]" : "text-slate-500 hover:text-white hover:bg-slate-800/50"
              )}>
              <item.icon className="h-5 w-5" />
              <span className="text-sm font-bold">{item.name}</span>
            </button>
          ))}

          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] my-6 ml-2">Operations</p>
          {[
            { id: "appointments", name: "Clinical Cases", icon: Calendar, badge: stats.pendingAppointments },
            { id: "staff", name: "Human Capital", icon: Briefcase },
            { id: "inventory", name: "Asset Registry", icon: HardDrive, badge: stats.equipmentAlerts },
            { id: "body-parts", name: "Service Catalog", icon: Settings },
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={cn(
                "w-full flex items-center justify-between px-5 py-4 rounded-[20px] transition-all duration-300",
                activeTab === item.id ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]" : "text-slate-500 hover:text-white hover:bg-slate-800/50"
              )}>
              <div className="flex items-center gap-4">
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-bold">{item.name}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-full", item.id === "inventory" ? "bg-orange-500" : "bg-red-500")}>{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800 space-y-4">
          <Link href="/pos" className="w-full flex items-center justify-center gap-3 bg-slate-800/50 hover:bg-primary text-slate-300 hover:text-white py-4 rounded-[20px] text-xs font-black uppercase tracking-widest transition-all border border-slate-700/50">
            <Monitor className="h-4 w-4" /> Launch POS Terminal
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow min-w-0 overflow-y-auto h-screen custom-scrollbar">
        <header className="bg-white/80 backdrop-blur-md border-b px-10 py-8 flex justify-between items-center sticky top-0 z-40">
          <div>
            <h1 className="text-3xl font-black text-secondary tracking-tighter uppercase italic">{activeTab.replace("-", " ")}</h1>
            <div className="flex items-center gap-2 mt-1">
               <div className={cn("w-2 h-2 rounded-full", isOnline ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-red-500")} />
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{isOnline ? "Server Link: Operational" : "Disconnected Mode"}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => syncData()} className="bg-secondary text-white px-8 py-4 rounded-[22px] font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-secondary/10">
              <RefreshCw className={cn("h-4 w-4 text-primary", isSyncing && "animate-spin")} /> {isSyncing ? "Syncing..." : "Global Sync"}
            </button>
          </div>
        </header>

        <div className="p-10 pb-20">
          {activeTab === "dashboard" && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { label: "Net Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
                  { label: "Personnel", value: stats.staffCount, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Active Queue", value: stats.pendingAppointments, icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
                  { label: "System Health", value: "99.8%", icon: Activity, color: "text-purple-600", bg: "bg-purple-50" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-8 rounded-[35px] border border-white shadow-[0_15px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:scale-[1.03] transition-all cursor-default">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", stat.bg, stat.color)}>
                      <stat.icon className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                      <p className="text-4xl font-black text-secondary tracking-tighter">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 {/* Machine Registry Summary */}
                 <div className="bg-white p-10 rounded-[45px] border border-white shadow-xl">
                    <div className="flex justify-between items-center mb-10">
                       <h3 className="text-xl font-black text-secondary tracking-tighter uppercase italic">Registry: Machines</h3>
                       <button onClick={() => setActiveTab("inventory")} className="text-primary font-black text-[10px] uppercase tracking-widest hover:underline">View Full Registry</button>
                    </div>
                    <div className="space-y-6">
                       {equipment.slice(0, 3).map(e => (
                         <div key={e.id} className="group flex items-center justify-between p-6 rounded-[28px] bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 transition-all">
                            <div className="flex items-center gap-5">
                               <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg", e.status === "operational" ? "bg-green-500 shadow-green-500/20" : "bg-orange-500 shadow-orange-500/20")}>
                                  <HardDrive className="h-6 w-6" />
                               </div>
                               <div>
                                  <p className="font-black text-secondary text-sm">{e.name}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{e.type} • {branches.find(b => b.id === e.branchId)?.name.split("-")[1]}</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 mb-1">Maint. Due</p>
                               <p className="text-xs font-bold text-secondary">{e.lastMaintenance}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* Revenue Intel */}
                 <div className="bg-secondary p-10 rounded-[45px] text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
                       <BarChart3 className="h-60 w-60" />
                    </div>
                    <div className="relative z-10">
                       <h3 className="text-xl font-black italic tracking-tighter uppercase mb-10">Revenue Intel</h3>
                       <div className="space-y-10">
                          {stats.branchBreakdown.map((b, i) => (
                            <div key={i} className="space-y-3">
                               <div className="flex justify-between items-end">
                                  <p className="text-sm font-black uppercase tracking-widest">{b.name}</p>
                                  <p className="text-2xl font-black text-primary italic tracking-tighter">${b.rev.toLocaleString()}</p>
                               </div>
                               <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: stats.totalRevenue > 0 ? `${(b.rev / stats.totalRevenue) * 100}%` : '0%' }} />
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="bg-white p-10 rounded-[45px] shadow-xl border border-white">
                     <h3 className="text-xl font-black text-secondary tracking-tighter uppercase italic mb-8">Clinical Revenue Share</h3>
                     <div className="space-y-8">
                        {[
                          { label: "Computed Tomography (CT)", rev: stats.ctRev, color: "bg-primary" },
                          { label: "Radiology (X-Ray)", rev: stats.xrRev, color: "bg-blue-400" },
                          { label: "Sonography (Ultrasound)", rev: stats.usRev, color: "bg-teal-400" },
                        ].map((item, i) => (
                          <div key={i} className="space-y-2">
                             <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span>{item.label}</span>
                                <span className="text-secondary font-black">${item.rev.toLocaleString()}</span>
                             </div>
                             <div className="h-5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-1">
                                <div className={cn("h-full rounded-full transition-all duration-1000", item.color)} style={{ width: stats.totalRevenue > 0 ? `${(item.rev / stats.totalRevenue) * 100}%` : '0%' }} />
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                  <div className="bg-white p-10 rounded-[45px] shadow-xl border border-white flex flex-col items-center justify-center text-center">
                     <div className="w-24 h-24 bg-green-50 text-green-500 rounded-[35px] flex items-center justify-center mb-6 shadow-lg shadow-green-500/10">
                        <TrendingUp className="h-10 w-10" />
                     </div>
                     <h3 className="text-2xl font-black text-secondary tracking-tighter uppercase italic mb-2">Growth Vector</h3>
                     <p className="text-slate-400 font-medium max-w-xs leading-relaxed italic">The facility is experiencing a <span className="text-green-600 font-black">+14.2%</span> yield increase month-over-month.</p>
                  </div>
               </div>

               <div className="bg-white p-10 rounded-[45px] shadow-xl border border-white">
                  <h3 className="text-xl font-black text-secondary tracking-tighter uppercase italic mb-8 text-center">Collection by Center</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                     {stats.branchBreakdown.map((b, i) => (
                       <div key={i} className="text-center p-8 bg-slate-50 rounded-[35px] border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{b.name}</p>
                          <p className="text-3xl font-black text-secondary tracking-tighter italic">${b.rev.toLocaleString()}</p>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === "inventory" && (
             <div className="bg-white rounded-[45px] shadow-xl border border-white overflow-hidden animate-in fade-in duration-500">
                <div className="p-10 border-b flex justify-between items-center">
                   <div>
                      <h3 className="text-xl font-black text-secondary tracking-tighter uppercase italic">Asset Registry</h3>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Medical Device Monitoring & Maintenance</p>
                   </div>
                   <button onClick={() => handleOpenEquipModal()} className="bg-secondary text-white px-8 py-4 rounded-[22px] font-black uppercase tracking-widest text-[10px] flex items-center gap-3">
                      <Plus className="h-4 w-4 text-primary" /> Register Machine
                   </button>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                            <th className="px-10 py-6">Hardware Identity</th>
                            <th className="px-10 py-6">Class</th>
                            <th className="px-10 py-6">Branch Station</th>
                            <th className="px-10 py-6">Next Service</th>
                            <th className="px-10 py-6">Health</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                         {equipment.map(e => (
                           <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-10 py-6 font-black text-secondary text-sm">{e.name}</td>
                              <td className="px-10 py-6 text-xs font-bold text-slate-500">{e.type}</td>
                              <td className="px-10 py-6 text-xs font-bold text-slate-600">{branches.find(b => b.id === e.branchId)?.name.split("-")[1]}</td>
                              <td className="px-10 py-6 text-xs font-bold text-slate-400">{e.lastMaintenance}</td>
                              <td className="px-10 py-6">
                                 <span className={cn(
                                   "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                   e.status === "operational" ? "bg-green-50 text-green-600 border-green-100" : "bg-orange-50 text-orange-600 border-orange-100"
                                 )}>{e.status}</span>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          )}

          {activeTab === "staff" && (
            <div className="bg-white rounded-[45px] shadow-xl border border-white overflow-hidden animate-in fade-in duration-500">
               <div className="p-10 border-b flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-black text-secondary tracking-tighter uppercase italic">Personnel Registry</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Authorized Clinical & Admin Access</p>
                  </div>
                  <button onClick={() => handleOpenStaffModal()} className="bg-secondary text-white px-8 py-4 rounded-[22px] font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-primary transition-all shadow-xl">
                    <UserPlus className="h-4 w-4" /> Register Staff
                  </button>
               </div>
               <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                      <th className="px-10 py-6">Identity</th>
                      <th className="px-10 py-6">Expertise</th>
                      <th className="px-10 py-6">Deployed At</th>
                      <th className="px-10 py-6">Activity</th>
                      <th className="px-10 py-6 text-right">Ops</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {staff.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-10 py-6">
                           <p className="font-black text-secondary text-sm">{s.name}</p>
                           <p className="text-[10px] text-slate-400 font-bold">{s.email}</p>
                        </td>
                        <td className="px-10 py-6"><span className="text-xs font-black uppercase tracking-widest text-slate-500">{s.role}</span></td>
                        <td className="px-10 py-6 text-xs font-bold text-slate-600">{branches.find(b => b.id === s.branchId)?.name.split("-")[1]}</td>
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-2">
                              <div className={cn("w-1.5 h-1.5 rounded-full", s.status === "active" ? "bg-green-500" : "bg-orange-500")} />
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{s.status}</span>
                           </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                           <button onClick={() => handleOpenStaffModal(s)} className="p-3 bg-slate-100 rounded-xl hover:bg-primary hover:text-white transition-all"><Edit2 className="h-3.5 w-3.5" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          )}

          {activeTab === "appointments" && (
            <div className="bg-white rounded-[45px] shadow-xl border border-white overflow-hidden animate-in fade-in duration-500">
               <div className="p-10 border-b flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-black text-secondary tracking-tighter uppercase italic">Case Management</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Real-time Patient Clinical Workflow</p>
                  </div>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                        <th className="px-10 py-6">Case Identity</th>
                        <th className="px-10 py-6">Diagnostic Service</th>
                        <th className="px-10 py-6">Verification</th>
                        <th className="px-10 py-6">Phase</th>
                        <th className="px-10 py-6 text-right">Ops</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {appointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-10 py-6">
                            <p className="font-black text-secondary text-sm italic">{apt.patientName}</p>
                            <p className="text-[10px] text-slate-400 font-bold">{apt.date} • {apt.time} Slot</p>
                          </td>
                          <td className="px-10 py-6 text-xs font-black text-slate-500 uppercase tracking-widest">{apt.scanName}</td>
                          <td className="px-10 py-6">
                            {apt.reportAttached ? (
                              <span className="flex items-center gap-2 text-green-600 text-[10px] font-black uppercase">
                                <ShieldCheck className="h-4 w-4" /> Final Report Uploaded
                              </span>
                            ) : (
                              <button onClick={() => attachReport(apt.id)} className="text-primary hover:underline text-[10px] font-black uppercase tracking-widest">Attach Clinical Result</button>
                            )}
                          </td>
                          <td className="px-10 py-6">
                            <span className={cn(
                              "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                              apt.status === "pending" ? "bg-orange-100 text-orange-700" :
                              apt.status === "confirmed" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                            )}>{apt.status}</span>
                          </td>
                          <td className="px-10 py-6 text-right">
                             <div className="flex justify-end gap-2">
                                {apt.status === "pending" && (
                                  <button onClick={() => updateAppointment(apt.id, "confirmed")} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all"><CheckCircle className="h-4 w-4" /></button>
                                )}
                                <button className="p-3 bg-slate-100 rounded-xl hover:bg-secondary hover:text-white transition-all"><FileText className="h-4 w-4" /></button>
                             </div>
                          </td>
                        </tr>
                      ))}
                      {appointments.length === 0 && <tr><td colSpan={5} className="py-20 text-center text-slate-300 font-black uppercase text-xs tracking-widest">No cases in clinical pipeline.</td></tr>}
                    </tbody>
                 </table>
               </div>
            </div>
          )}

          {activeTab === "body-parts" && (
            <div className="bg-white rounded-[45px] shadow-xl border border-white overflow-hidden animate-in fade-in duration-500">
               <div className="p-10 border-b flex justify-between items-center">
                  <h3 className="text-xl font-black text-secondary tracking-tighter uppercase italic">Service Catalog</h3>
                  <button onClick={() => handleOpenRecordModal()} className="bg-primary text-white px-8 py-4 rounded-[22px] font-black uppercase tracking-widest text-[10px] flex items-center gap-3 shadow-lg shadow-primary/20">
                    <Plus className="h-4 w-4" /> Define Service
                  </button>
               </div>
               <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                      <th className="px-10 py-6">Procedure</th>
                      <th className="px-10 py-6">Clinical Group</th>
                      <th className="px-10 py-6 text-center">Protocol Time</th>
                      <th className="px-10 py-6 text-center">Unit Price</th>
                      <th className="px-10 py-6 text-right">Ops</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {records.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-10 py-6 font-black text-secondary text-sm">{r.name}</td>
                        <td className="px-10 py-6"><span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest">{r.category}</span></td>
                        <td className="px-10 py-6 text-center text-xs font-bold text-slate-500">{r.duration}</td>
                        <td className="px-10 py-6 text-center font-black text-secondary text-lg">${r.price}</td>
                        <td className="px-10 py-6 text-right">
                           <div className="flex justify-end gap-2">
                              <button onClick={() => handleOpenRecordModal(r)} className="p-3 bg-slate-100 rounded-xl hover:bg-secondary hover:text-white transition-all"><Edit2 className="h-3.5 w-3.5" /></button>
                              <button onClick={() => deleteRecord(r.id)} className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 className="h-3.5 w-3.5" /></button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          )}

          {activeTab === "logs" && (
            <div className="bg-white rounded-[45px] shadow-xl border border-white p-10 animate-in fade-in duration-500">
               <h3 className="text-xl font-black text-secondary tracking-tighter uppercase italic mb-10 text-center">System Audit Trail</h3>
               <div className="space-y-4 max-w-5xl mx-auto">
                  {auditLogs.map(log => (
                    <div key={log.id} className="flex items-center gap-8 p-8 rounded-[30px] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all group">
                       <div className="w-32 font-black text-slate-300 font-mono text-xs italic">{log.timestamp.split(",")[1]}</div>
                       <div className="w-40">
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-widest">{log.module}</span>
                       </div>
                       <div className="flex-grow font-black text-secondary text-sm group-hover:text-primary transition-colors italic">{log.action}</div>
                       <div className="text-slate-400 font-black uppercase text-[10px] tracking-widest border-l pl-8 italic">{log.user}</div>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>
      </main>

      {/* Unified Enterprise Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-secondary/80 backdrop-blur-2xl z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[60px] shadow-[0_50px_100px_rgba(0,0,0,0.5)] w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
            <div className="p-16 border-b bg-slate-50/50 flex justify-between items-center relative">
              <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-45">
                 <ShieldCheck className="h-40 w-40" />
              </div>
              <div className="relative z-10">
                <h3 className="text-5xl font-black text-secondary tracking-tighter uppercase italic">{editingItem ? "Update" : "Add Entry"}</h3>
                <p className="text-[10px] text-primary font-black uppercase tracking-[0.5em] mt-4 ml-1">Registry Synchronization</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-6 bg-white rounded-[30px] shadow-xl text-slate-300 hover:text-red-500 transition-all active:scale-90 relative z-10"><X className="h-10 w-10" /></button>
            </div>

            <form onSubmit={handleSave} className="p-16 space-y-12">
               {modalType === "record" && (
                 <div className="space-y-10">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Clinical Procedure Name</label>
                      <input required type="text" className="w-full px-10 py-7 rounded-[35px] border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none text-2xl font-black italic shadow-inner" placeholder="E.G. BRAIN MRI" value={recordForm.name} onChange={e => setRecordRecordForm({...recordForm, name: e.target.value})} />
                   </div>
                   <div className="grid grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Procedure Group</label>
                        <input type="text" className="w-full px-10 py-7 rounded-[35px] border-2 border-slate-100 focus:border-primary outline-none font-black text-lg italic shadow-sm" placeholder="E.G. TORSO" value={recordForm.category} onChange={e => setRecordRecordForm({...recordForm, category: e.target.value})} />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Fee Structure ($)</label>
                        <input type="number" className="w-full px-10 py-7 rounded-[35px] border-2 border-slate-100 focus:border-primary outline-none font-black text-3xl italic text-primary shadow-sm" value={recordForm.price} onChange={e => setRecordRecordForm({...recordForm, price: parseInt(e.target.value) || 0})} />
                      </div>
                   </div>
                 </div>
               )}

               {modalType === "staff" && (
                 <div className="space-y-10">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Full Legal Identity</label>
                      <input required type="text" className="w-full px-10 py-7 rounded-[35px] border-2 border-slate-100 focus:border-primary outline-none text-2xl font-black italic shadow-inner" value={staffForm.name} onChange={e => setStaffForm({...staffForm, name: e.target.value})} />
                   </div>
                   <div className="grid grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Station Deployment</label>
                        <select className="w-full px-10 py-7 rounded-[35px] border-2 border-slate-100 focus:border-primary outline-none font-black bg-white appearance-none italic shadow-sm" value={staffForm.branchId} onChange={e => setStaffForm({...staffForm, branchId: e.target.value})}>
                           {branches.map(b => <option key={b.id} value={b.id}>{b.name.split("-")[1]}</option>)}
                        </select>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Professional Grade</label>
                        <select className="w-full px-10 py-7 rounded-[35px] border-2 border-slate-100 focus:border-primary outline-none font-black bg-white appearance-none italic shadow-sm" value={staffForm.role} onChange={e => setStaffForm({...staffForm, role: e.target.value as any})}>
                           {["Radiologist", "Doctor", "Nurse", "Receptionist", "Admin"].map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                   </div>
                 </div>
               )}

               {modalType === "equipment" && (
                 <div className="space-y-10">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Machine Serial Name</label>
                       <input required type="text" className="w-full px-10 py-7 rounded-[35px] border-2 border-slate-100 focus:border-primary outline-none text-2xl font-black italic shadow-inner" value={equipForm.name} onChange={e => setEquipForm({...equipForm, name: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-10">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Station</label>
                          <select className="w-full px-10 py-7 rounded-[35px] border-2 border-slate-100 focus:border-primary outline-none font-black bg-white appearance-none italic shadow-sm" value={equipForm.branchId} onChange={e => setEquipForm({...equipForm, branchId: e.target.value})}>
                             {branches.map(b => <option key={b.id} value={b.id}>{b.name.split("-")[1]}</option>)}
                          </select>
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Current Health</label>
                          <select className="w-full px-10 py-7 rounded-[35px] border-2 border-slate-100 focus:border-primary outline-none font-black bg-white appearance-none italic shadow-sm" value={equipForm.status} onChange={e => setEquipForm({...equipForm, status: e.target.value as any})}>
                             <option value="operational">Operational</option>
                             <option value="maintenance-required">Maint. Required</option>
                             <option value="faulty">System Fault</option>
                          </select>
                       </div>
                    </div>
                 </div>
               )}

               <button type="submit" className="w-full bg-secondary text-white py-10 rounded-[40px] font-black uppercase tracking-[0.2em] text-lg flex items-center justify-center gap-5 hover:bg-primary transition-all shadow-[0_30px_60px_rgba(0,0,0,0.15)] active:scale-95">
                  <Save className="h-8 w-8 text-primary" /> Confirm Changes
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
