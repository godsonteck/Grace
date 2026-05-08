"use client";

import { useState, useMemo } from "react";
import { scanTypes, branches, BodyPart, Invoice, Staff, Equipment, Appointment, Patient } from "@/lib/data";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, Plus, Search, Edit2, Trash2, DollarSign,
  Settings, Users, X, Save, Calendar, CheckCircle, Clock,
  Printer, CreditCard, ShoppingCart, ArrowRight, RefreshCw, Wifi, WifiOff, BarChart3, TrendingUp, Monitor, HardDrive, ShieldCheck, ClipboardList, Briefcase, UserPlus, FileText, Activity, AlertTriangle, LogOut, Microscope, MapPin, ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function AdminPage() {
  const {
    records, appointments, invoices, staff, equipment, auditLogs, patients, isOnline, isSyncing,
    addRecord, updateRecord, deleteRecord,
    updateAppointment, attachReport, addStaff, updateStaff, deleteStaff, addEquipment, updateEquipment, deleteEquipment,
    addPatient, updatePatient, syncData
  } = useData();

  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [globalBranchFilter, setGlobalBranchFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"record" | "staff" | "equipment" | "report" | "patient">("record");
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Form States
  const [recordForm, setRecordRecordForm] = useState({ name: "", scanTypeId: "ct-scan", category: "General", price: 0, duration: "20 mins", preparation: "" });
  const [staffForm, setStaffForm] = useState<Staff>({ id: "", name: "", role: "Radiologist", branchId: branches[0].id, phone: "", email: "", status: "active" });
  const [equipForm, setEquipForm] = useState<Equipment>({ id: "", name: "", type: "CT Scanner", branchId: branches[0].id, lastMaintenance: "", status: "operational" });
  const [patientForm, setPatientForm] = useState<Patient>({ id: "", name: "", email: "", phone: "", dob: "", gender: "Male", bloodGroup: "O+", history: [] });
  const [reportContent, setReportContent] = useState("");

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

  const handleOpenPatientModal = (pt?: Patient) => {
    setModalType("patient");
    if (pt) {
      setEditingItem(pt);
      setPatientForm({ ...pt });
    } else {
      setEditingItem(null);
      setPatientForm({ id: `pat-${Date.now()}`, name: "", email: "", phone: "", dob: "", gender: "Male", bloodGroup: "O+", history: [] });
    }
    setIsModalOpen(true);
  };

  const handleOpenReportModal = (apt: Appointment) => {
    setModalType("report");
    setEditingItem(apt);
    setReportContent("");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === "record") {
      editingItem ? updateRecord({ ...editingItem, ...recordForm }) : addRecord({ id: `rc-${Date.now()}`, ...recordForm });
    } else if (modalType === "staff") {
      editingItem ? updateStaff({ ...staffForm }) : addStaff(staffForm);
    } else if (modalType === "equipment") {
      editingItem ? updateEquipment(equipForm) : addEquipment(equipForm);
    } else if (modalType === "patient") {
      editingItem ? updatePatient(patientForm) : addPatient(patientForm);
    } else if (modalType === "report") {
      attachReport(editingItem.id);
    }
    setIsModalOpen(false);
  };

  // FILTERED DATA
  const filteredAppointments = useMemo(() =>
    appointments.filter(a => globalBranchFilter === "all" || a.branchId === globalBranchFilter),
    [appointments, globalBranchFilter]
  );

  const filteredStaff = useMemo(() =>
    staff.filter(s => globalBranchFilter === "all" || s.branchId === globalBranchFilter),
    [staff, globalBranchFilter]
  );

  const filteredEquipment = useMemo(() =>
    equipment.filter(e => globalBranchFilter === "all" || e.branchId === globalBranchFilter),
    [equipment, globalBranchFilter]
  );

  const filteredInvoices = useMemo(() =>
    invoices.filter(i => {
      const branchObj = branches.find(b => b.name === i.branchName);
      return globalBranchFilter === "all" || branchObj?.id === globalBranchFilter;
    }),
    [invoices, globalBranchFilter]
  );

  const stats = useMemo(() => {
    const paidInvoices = filteredInvoices.filter(i => i.status === "paid");
    return {
      totalScans: records.length,
      pendingAppointments: filteredAppointments.filter(a => a.status === "pending").length,
      totalRevenue: paidInvoices.reduce((acc, curr) => acc + curr.amount, 0),
      staffCount: filteredStaff.length,
      equipmentAlerts: filteredEquipment.filter(e => e.status !== "operational").length,
      patientCount: patients.length,
      ctRev: paidInvoices.filter(i => i.scanName.toLowerCase().includes("ct")).reduce((acc, curr) => acc + curr.amount, 0),
      xrRev: paidInvoices.filter(i => i.scanName.toLowerCase().includes("x-ray") || i.scanName.toLowerCase().includes("xr")).reduce((acc, curr) => acc + curr.amount, 0),
      usRev: paidInvoices.filter(i => i.scanName.toLowerCase().includes("ultrasound") || i.scanName.toLowerCase().includes("us")).reduce((acc, curr) => acc + curr.amount, 0),
      branchBreakdown: branches.map(b => ({
        name: b.name.split("-")[1].trim(),
        rev: filteredInvoices.filter(i => i.branchName === b.name && i.status === "paid").reduce((acc, curr) => acc + curr.amount, 0)
      }))
    };
  }, [records, filteredAppointments, filteredInvoices, filteredStaff, filteredEquipment, patients]);

  const navItems = [
    { id: "dashboard", name: "Executive Suite", icon: LayoutDashboard, roles: ['ADMIN'] },
    { id: "reports", name: "Financial Intel", icon: BarChart3, roles: ['ADMIN'] },
    { id: "appointments", name: "Clinical Pipeline", icon: Microscope, badge: stats.pendingAppointments, roles: ['ADMIN', 'RADIOLOGIST'] },
    { id: "patients", name: "Patient EHR", icon: Users, roles: ['ADMIN', 'RADIOLOGIST'] },
    { id: "staff", name: "Human Capital", icon: Briefcase, roles: ['ADMIN'] },
    { id: "inventory", name: "Asset Registry", icon: HardDrive, badge: stats.equipmentAlerts, roles: ['ADMIN', 'RADIOLOGIST'] },
    { id: "body-parts", name: "Services", icon: Settings, roles: ['ADMIN'] },
    { id: "logs", name: "Audit Trail", icon: ClipboardList, roles: ['ADMIN'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(user?.role || ''));

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-secondary">
      {/* Sidebar */}
      <aside className="w-72 bg-secondary text-white hidden md:flex flex-col sticky top-0 h-screen shadow-2xl z-[150]">
        <div className="p-8 border-b border-slate-800">
          <div className="flex items-center gap-3">
             <div className="bg-primary p-2 rounded-xl rotate-3 shadow-lg shadow-primary/20">
                <ShieldCheck className="h-6 w-6 text-white" />
             </div>
             <div>
                <h2 className="text-xl font-black tracking-tighter italic">GRACE<span className="text-primary not-italic">CORE</span></h2>
             </div>
          </div>
        </div>

        <nav className="flex-grow p-6 space-y-1 overflow-y-auto custom-scrollbar">
          {filteredNav.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={cn(
                "w-full flex items-center justify-between px-5 py-4 rounded-[20px] transition-all duration-300",
                activeTab === item.id ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]" : "text-slate-500 hover:text-white hover:bg-slate-800/50"
              )}>
              <div className="flex items-center gap-4">
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-bold uppercase tracking-widest text-[10px]">{item.name}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-full", item.id === "inventory" ? "bg-orange-500" : "bg-red-500")}>{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800 space-y-4">
          <div className="bg-slate-800/30 p-5 rounded-[30px] border border-slate-700/50 relative overflow-hidden group">
             <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center font-black text-white italic shadow-lg shadow-primary/20">{user?.name.charAt(0)}</div>
                <div className="min-w-0">
                   <p className="text-xs font-black text-white truncate uppercase italic">{user?.name}</p>
                   <p className="text-[9px] font-black text-slate-500 tracking-[0.2em]">{user?.role}</p>
                </div>
             </div>
             <button onClick={logout} className="w-full py-3 rounded-xl bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500 hover:text-white transition-all">Terminate</button>
          </div>
          <Link href="/pos" className="w-full flex items-center justify-center gap-3 bg-primary/10 hover:bg-primary text-primary hover:text-white py-4 rounded-[25px] text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-primary/20">
            <Monitor className="h-4 w-4" /> Launch POS
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow min-w-0 overflow-y-auto h-screen custom-scrollbar">
        <header className="bg-white/90 backdrop-blur-xl border-b px-10 py-8 flex justify-between items-center sticky top-0 z-[140] shadow-sm">
          <div className="flex items-center gap-8">
            <div>
              <h1 className="text-3xl font-black text-secondary tracking-tighter uppercase italic">{activeTab.replace("-", " ")}</h1>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Enterprise Orchestrator</p>
            </div>

            <div className="hidden lg:flex items-center gap-3 bg-slate-50 p-2 rounded-[25px] border border-slate-100">
               <div className="p-3 bg-white rounded-2xl shadow-sm text-primary"><MapPin className="h-4 w-4" /></div>
               <select className="bg-transparent border-none outline-none pr-8 font-black text-[10px] uppercase tracking-widest text-slate-500 appearance-none cursor-pointer" value={globalBranchFilter} onChange={(e) => setGlobalBranchFilter(e.target.value)}>
                  <option value="all">Global (All Centers)</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.name.split("-")[1].trim()}</option>)}
               </select>
            </div>
          </div>
          <button onClick={() => syncData()} className="bg-secondary text-white px-8 py-4 rounded-[22px] font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-secondary/10">
            <RefreshCw className={cn("h-4 w-4 text-primary", isSyncing && "animate-spin")} /> {isSyncing ? "Syncing..." : "Sync Cluster"}
          </button>
        </header>

        <div className="p-10 pb-20">
          {activeTab === "dashboard" && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { label: "Aggregate Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
                  { label: "Unit Personnel", value: stats.staffCount, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Center Backlog", value: stats.pendingAppointments, icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
                  { label: "Hardware Health", value: "99.9%", icon: Activity, color: "text-purple-600", bg: "bg-purple-50" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-8 rounded-[40px] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:scale-[1.05] transition-all cursor-default relative overflow-hidden group">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-inner relative z-10", stat.bg, stat.color)}>
                      <stat.icon className="h-7 w-7" />
                    </div>
                    <div className="relative z-10">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mb-2 italic">{stat.label}</p>
                      <p className="text-4xl font-black text-secondary tracking-tighter italic">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 <div className="bg-white p-12 rounded-[50px] border border-white shadow-2xl">
                    <h3 className="text-2xl font-black text-secondary tracking-tighter uppercase italic mb-12">Station Logistics</h3>
                    <div className="space-y-6">
                       {filteredEquipment.slice(0, 4).map(e => (
                         <div key={e.id} className="group flex items-center justify-between p-7 rounded-[30px] bg-slate-50 border-2 border-transparent transition-all">
                            <div className="flex items-center gap-6">
                               <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white", e.status === "operational" ? "bg-green-500" : "bg-orange-500")}>
                                  <HardDrive className="h-7 w-7" />
                               </div>
                               <div>
                                  <p className="font-black text-secondary text-base italic uppercase">{e.name}</p>
                                  <p className="text-[10px] text-slate-400 font-black uppercase mt-1">{e.type} • {branches.find(b => b.id === e.branchId)?.name.split("-")[1]}</p>
                               </div>
                            </div>
                         </div>
                       ))}
                       {filteredEquipment.length === 0 && <p className="py-10 text-center text-slate-400 italic">No equipment at this station.</p>}
                    </div>
                 </div>

                 <div className="bg-secondary p-12 rounded-[50px] text-white shadow-2xl relative overflow-hidden">
                    <h3 className="text-2xl font-black italic uppercase mb-12">Revenue Intel</h3>
                    <div className="space-y-12">
                       {stats.branchBreakdown.filter(b => globalBranchFilter === "all" || b.name === branches.find(br => br.id === globalBranchFilter)?.name.split("-")[1].trim()).map((b, i) => (
                         <div key={i} className="space-y-4">
                            <div className="flex justify-between items-end">
                               <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 italic">{b.name}</p>
                               <p className="text-4xl font-black text-primary italic tracking-tighter">${b.rev.toLocaleString()}</p>
                            </div>
                            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                               <div className="h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_15px_#C8A97E]" style={{ width: stats.totalRevenue > 0 ? `${(b.rev / stats.totalRevenue) * 100}%` : '0%' }} />
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === "reports" && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in duration-500">
                <div className="bg-white p-12 rounded-[50px] shadow-2xl border border-white">
                   <h3 className="text-2xl font-black text-secondary tracking-tighter uppercase italic mb-10">Revenue Yield / Dept</h3>
                   <div className="space-y-10">
                      {[
                        { label: "CT (Computed Tomography)", rev: stats.ctRev, color: "bg-primary" },
                        { label: "XR (Radiology)", rev: stats.xrRev, color: "bg-blue-400" },
                        { label: "US (Sonography)", rev: stats.usRev, color: "bg-teal-400" },
                      ].map((item, i) => (
                        <div key={i} className="space-y-3">
                           <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                              <span>{item.label}</span>
                              <span className="text-secondary font-black">${item.rev.toLocaleString()}</span>
                           </div>
                           <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                              <div className={cn("h-full transition-all duration-1000", item.color)} style={{ width: stats.totalRevenue > 0 ? `${(item.rev / stats.totalRevenue) * 100}%` : '0%' }} />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="bg-white p-12 rounded-[50px] shadow-2xl border border-white flex flex-col items-center justify-center text-center">
                   <div className="w-24 h-24 bg-green-50 text-green-500 rounded-[35px] flex items-center justify-center mb-6 shadow-lg shadow-green-500/10">
                      <TrendingUp className="h-10 w-10" />
                   </div>
                   <h3 className="text-2xl font-black text-secondary tracking-tighter uppercase italic mb-2">Growth Index</h3>
                   <p className="text-slate-400 font-medium max-w-xs italic text-sm">System intelligence suggests a stable upward vector of +14.2% yield optimization.</p>
                </div>
             </div>
          )}

          {activeTab === "appointments" && (
            <div className="bg-white rounded-[50px] shadow-2xl border border-white overflow-hidden animate-in fade-in zoom-in duration-500">
               <div className="p-12 border-b bg-slate-50/30 flex justify-between items-center">
                  <h3 className="text-2xl font-black text-secondary tracking-tighter uppercase italic">Pipeline: Clinical</h3>
               </div>
               <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">
                      <th className="px-12 py-8">Case ID</th>
                      <th className="px-12 py-8">Clinical Group</th>
                      <th className="px-12 py-8 text-center">Verification Status</th>
                      <th className="px-12 py-8 text-right">Settlement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredAppointments.map(apt => (
                      <tr key={apt.id}>
                        <td className="px-12 py-8">
                           <p className="font-black text-secondary text-base italic uppercase">{apt.patientName}</p>
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">{branches.find(b => b.id === apt.branchId)?.name.split("-")[1]} • {apt.date}</p>
                        </td>
                        <td className="px-12 py-8"><span className="text-xs font-black uppercase text-slate-500 italic">{apt.scanName}</span></td>
                        <td className="px-12 py-8 text-center">
                           {apt.reportAttached ? (
                             <span className="inline-flex items-center gap-3 text-green-600 text-[10px] font-black uppercase italic"><ShieldCheck className="h-5 w-5" /> Result Attested</span>
                           ) : (
                             <button onClick={() => handleOpenReportModal(apt)} className="text-primary hover:text-secondary bg-primary/5 px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all border border-primary/10">Verification Pending</button>
                           )}
                        </td>
                        <td className="px-12 py-8 text-right">
                           <button onClick={() => updateAppointment(apt.id, "confirmed")} className="p-4 bg-white border shadow-xl rounded-2xl hover:bg-green-600 hover:text-white transition-all"><CheckCircle className="h-5 w-5" /></button>
                        </td>
                      </tr>
                    ))}
                    {filteredAppointments.length === 0 && <tr><td colSpan={4} className="py-20 text-center text-slate-300 italic uppercase text-xs font-black tracking-widest">Station node clear.</td></tr>}
                  </tbody>
               </table>
            </div>
          )}

          {activeTab === "patients" && (
            <div className="bg-white rounded-[50px] shadow-2xl border border-white overflow-hidden animate-in fade-in duration-700">
               <div className="p-12 border-b bg-slate-50/30 flex justify-between items-center">
                  <h3 className="text-2xl font-black text-secondary tracking-tighter uppercase italic">Patient EHR Database</h3>
                  <button onClick={() => handleOpenPatientModal()} className="bg-secondary text-white px-8 py-4 rounded-[22px] font-black uppercase tracking-widest text-[10px] flex items-center gap-3 shadow-xl">
                    <UserPlus className="h-4 w-4" /> Enroll Patient
                  </button>
               </div>
               <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">
                      <th className="px-12 py-8">Full Identity</th>
                      <th className="px-12 py-8">Medical Info</th>
                      <th className="px-12 py-8">Contact Node</th>
                      <th className="px-12 py-8 text-right">Ops</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {patients.map(pt => (
                      <tr key={pt.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-12 py-8">
                           <p className="font-black text-secondary text-base italic uppercase">{pt.name}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase">{pt.gender} • DOB: {pt.dob}</p>
                        </td>
                        <td className="px-12 py-8"><span className="text-xs font-black uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">Blood: {pt.bloodGroup}</span></td>
                        <td className="px-12 py-8 text-xs font-bold text-slate-500 uppercase">{pt.phone}</td>
                        <td className="px-12 py-8 text-right"><button onClick={() => handleOpenPatientModal(pt)} className="p-4 bg-slate-100 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm"><Edit2 className="h-4 w-4" /></button></td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          )}

          {activeTab === "staff" && (
            <div className="bg-white rounded-[50px] shadow-2xl border border-white overflow-hidden animate-in fade-in duration-700">
               <div className="p-12 border-b bg-slate-50/30 flex justify-between items-center">
                  <h3 className="text-2xl font-black text-secondary tracking-tighter uppercase italic">Human Capital</h3>
                  <button onClick={() => handleOpenStaffModal()} className="bg-secondary text-white px-10 py-5 rounded-[28px] font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 hover:bg-primary transition-all shadow-2xl">
                    <UserPlus className="h-4 w-4" /> Recruit Personnel
                  </button>
               </div>
               <table className="w-full text-left">
                  <tbody className="divide-y divide-slate-50">
                    {filteredStaff.map(s => (
                      <tr key={s.id}>
                        <td className="px-12 py-8">
                           <p className="font-black text-secondary text-base italic uppercase">{s.name}</p>
                           <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.1em] mt-1">{s.email}</p>
                        </td>
                        <td className="px-12 py-8 text-center"><span className="text-xs font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-4 py-1.5 rounded-full">{s.role}</span></td>
                        <td className="px-12 py-8 text-right">
                           <div className="flex justify-end gap-2">
                              <button onClick={() => handleOpenStaffModal(s)} className="p-4 bg-slate-100 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm"><Edit2 className="h-4 w-4" /></button>
                              <button onClick={() => deleteStaff(s.id)} className="p-4 bg-red-50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 className="h-4 w-4" /></button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          )}

          {activeTab === "body-parts" && (
            <div className="bg-white rounded-[50px] shadow-2xl border border-white overflow-hidden animate-in fade-in duration-500">
               <div className="p-12 border-b bg-slate-50/30 flex justify-between items-center">
                  <h3 className="text-2xl font-black text-secondary tracking-tighter uppercase italic">Service Catalog</h3>
                  <button onClick={() => handleOpenRecordModal()} className="bg-primary text-white px-10 py-5 rounded-[28px] font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-3">
                    <Plus className="h-4 w-4 text-white" /> Define Service
                  </button>
               </div>
               <table className="w-full text-left">
                  <tbody className="divide-y divide-slate-50">
                    {records.map(r => (
                      <tr key={r.id}>
                        <td className="px-12 py-8 font-black text-secondary text-sm italic">{r.name}</td>
                        <td className="px-12 py-8 text-center font-black text-secondary text-xl tracking-tighter">${r.price.toLocaleString()}</td>
                        <td className="px-12 py-8 text-right">
                           <div className="flex justify-end gap-2">
                              <button onClick={() => handleOpenRecordModal(r)} className="p-4 bg-slate-100 rounded-2xl hover:bg-secondary hover:text-white transition-all"><Edit2 className="h-4 w-4" /></button>
                              <button onClick={() => deleteRecord(r.id)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><Trash2 className="h-4 w-4" /></button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          )}

          {activeTab === "inventory" && (
            <div className="bg-white rounded-[50px] shadow-2xl border border-white overflow-hidden animate-in fade-in duration-500">
               <div className="p-12 border-b bg-slate-50/30 flex justify-between items-center">
                  <h3 className="text-2xl font-black text-secondary tracking-tighter uppercase italic">Asset Registry</h3>
                  <button onClick={() => handleOpenEquipModal()} className="bg-secondary text-white px-10 py-5 rounded-[28px] font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-3">
                    <Plus className="h-4 w-4" /> Register Machine
                  </button>
               </div>
               <table className="w-full text-left">
                  <tbody className="divide-y divide-slate-50">
                    {filteredEquipment.map(e => (
                      <tr key={e.id}>
                        <td className="px-12 py-8 font-black text-secondary text-sm italic uppercase">{e.name}</td>
                        <td className="px-12 py-8 text-center"><span className={cn("px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border", e.status === "operational" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600")}>{e.status}</span></td>
                        <td className="px-12 py-8 text-right">
                           <div className="flex justify-end gap-2">
                              <button onClick={() => handleOpenEquipModal(e)} className="p-4 bg-slate-100 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm"><Edit2 className="h-4 w-4" /></button>
                              <button onClick={() => deleteEquipment(e.id)} className="p-4 bg-red-50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 className="h-4 w-4" /></button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          )}

          {activeTab === "logs" && (
             <div className="bg-white rounded-[50px] shadow-2xl border border-white p-12 animate-in fade-in duration-500">
                <h3 className="text-2xl font-black text-secondary tracking-tighter uppercase italic mb-12 text-center underline decoration-primary decoration-8">Audit Trail</h3>
                <div className="space-y-4 max-w-4xl mx-auto">
                   {auditLogs.map(log => (
                     <div key={log.id} className="grid grid-cols-4 gap-4 p-8 rounded-[35px] bg-slate-50 border-2 border-slate-100 text-[10px] font-black uppercase tracking-widest italic group hover:bg-white hover:shadow-xl transition-all">
                        <div className="text-slate-300">{log.timestamp}</div>
                        <div className="text-primary">{log.module}</div>
                        <div className="text-secondary group-hover:text-primary transition-colors">{log.action}</div>
                        <div className="text-right text-slate-400">{log.user}</div>
                     </div>
                   ))}
                </div>
             </div>
          )}
        </div>
      </main>

      {/* Unified Enterprise Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-secondary/95 backdrop-blur-3xl z-[200] flex items-center justify-center p-6">
          <div className="bg-white rounded-[70px] shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-500">
            <div className="p-20 border-b bg-slate-50/50 flex justify-between items-center relative">
               <div className="absolute top-0 right-0 p-16 opacity-5 scale-150 rotate-45 pointer-events-none"><ShieldCheck className="h-60 w-60 text-primary" /></div>
               <div className="relative z-10">
                  <h3 className="text-6xl font-black text-secondary tracking-tighter uppercase italic">{editingItem ? "Update" : "Add Entry"}</h3>
                  <p className="text-[11px] text-primary font-black uppercase tracking-[0.8em] mt-6 ml-2 italic">Verification Protocol 1.04-X</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="p-8 bg-white rounded-[40px] shadow-2xl text-slate-300 hover:text-red-500 active:scale-90 transition-all relative z-10 border border-slate-100"><X className="h-12 w-12" /></button>
            </div>

            <form onSubmit={handleSave} className="p-20 space-y-16 overflow-y-auto max-h-[60vh] custom-scrollbar">
               {modalType === "report" && (
                 <div className="space-y-12">
                    <div className="p-10 rounded-[45px] bg-blue-50 border-4 border-blue-100 italic relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform"><Microscope className="h-32 w-32" /></div>
                       <p className="text-xs font-black text-blue-400 uppercase tracking-[0.5em] mb-6 flex items-center gap-3 relative z-10 italic">Clinical Intelligence</p>
                       <p className="text-4xl font-black text-blue-900 tracking-tighter uppercase leading-none relative z-10">{editingItem.patientName}</p>
                       <p className="text-sm font-bold text-blue-700 mt-4 relative z-10 italic">{editingItem.scanName} • Pipeline Node: #{editingItem.id}</p>
                    </div>
                    <div className="space-y-6">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] ml-6 italic">Radiology Findings & Impression</label>
                       <textarea required rows={5} className="w-full px-12 py-10 rounded-[50px] border-4 border-slate-50 focus:border-primary outline-none font-black text-2xl italic bg-slate-50/50 shadow-inner resize-none transition-all" placeholder="SYNTHESIZE RESULT..." value={reportContent} onChange={e => setReportContent(e.target.value)} />
                    </div>
                 </div>
               )}

               {modalType === "staff" && (
                 <div className="space-y-12">
                   <div className="space-y-6">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] ml-6 italic">Personnel Legal Identity</label>
                      <input required type="text" className="w-full px-12 py-10 rounded-[50px] border-4 border-slate-50 focus:border-primary outline-none text-4xl font-black italic shadow-inner bg-slate-50/30" value={staffForm.name} onChange={e => setStaffForm({...staffForm, name: e.target.value})} />
                   </div>
                   <div className="grid grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] ml-6 italic">Deployment Node</label>
                        <select className="w-full px-12 py-10 rounded-[50px] border-4 border-slate-50 focus:border-primary outline-none font-black text-xl bg-white appearance-none italic shadow-sm" value={staffForm.branchId} onChange={e => setStaffForm({...staffForm, branchId: e.target.value})}>
                           {branches.map(b => <option key={b.id} value={b.id}>{b.name.split("-")[1].trim().toUpperCase()}</option>)}
                        </select>
                      </div>
                      <div className="space-y-6">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] ml-6 italic">Security Clearance</label>
                        <select className="w-full px-12 py-10 rounded-[50px] border-4 border-slate-50 focus:border-primary outline-none font-black text-xl bg-white appearance-none italic shadow-sm" value={staffForm.role} onChange={e => setStaffForm({...staffForm, role: e.target.value as any})}>
                           {["Radiologist", "Doctor", "Nurse", "Receptionist", "Admin"].map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
                        </select>
                      </div>
                   </div>
                 </div>
               )}

               {modalType === "record" && (
                 <div className="space-y-12">
                   <div className="space-y-6">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] ml-6 italic">Service Name</label>
                      <input required type="text" className="w-full px-12 py-10 rounded-[50px] border-4 border-slate-50 focus:border-primary outline-none text-4xl font-black italic shadow-inner bg-slate-50/30" value={recordForm.name} onChange={e => setRecordRecordForm({...recordForm, name: e.target.value})} />
                   </div>
                   <div className="grid grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] ml-6 italic">Fee Structure ($)</label>
                        <input type="number" className="w-full px-12 py-10 rounded-[50px] border-4 border-slate-50 focus:border-primary outline-none font-black text-3xl italic text-primary shadow-sm" value={recordForm.price} onChange={e => setRecordRecordForm({...recordForm, price: parseInt(e.target.value) || 0})} />
                      </div>
                      <div className="space-y-6">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] ml-6 italic">Protocol Time</label>
                        <input type="text" className="w-full px-12 py-10 rounded-[50px] border-4 border-slate-50 focus:border-primary outline-none font-black text-xl italic" value={recordForm.duration} onChange={e => setRecordRecordForm({...recordForm, duration: e.target.value})} />
                      </div>
                   </div>
                 </div>
               )}

               {modalType === "equipment" && (
                 <div className="space-y-12">
                    <div className="space-y-6">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 italic font-black">Machine Serial Name</label>
                       <input required type="text" className="w-full px-12 py-10 rounded-[50px] border-4 border-slate-50 focus:border-primary outline-none text-4xl font-black italic shadow-inner bg-slate-50/30" value={equipForm.name} onChange={e => setEquipForm({...equipForm, name: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-10">
                       <div className="space-y-6">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 italic font-black">Deployment Node</label>
                          <select className="w-full px-12 py-10 rounded-[50px] border-4 border-slate-50 focus:border-primary outline-none font-black text-xl bg-white appearance-none italic shadow-sm" value={equipForm.branchId} onChange={e => setEquipForm({...equipForm, branchId: e.target.value})}>
                             {branches.map(b => <option key={b.id} value={b.id}>{b.name.split("-")[1].trim().toUpperCase()}</option>)}
                          </select>
                       </div>
                       <div className="space-y-6">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 italic font-black">Operational Health</label>
                          <select className="w-full px-12 py-10 rounded-[50px] border-4 border-slate-50 focus:border-primary outline-none font-black text-xl bg-white appearance-none italic shadow-sm" value={equipForm.status} onChange={e => setEquipForm({...equipForm, status: e.target.value as any})}>
                             <option value="operational">OPERATIONAL</option>
                             <option value="maintenance-required">MAINT. REQUIRED</option>
                             <option value="faulty">SYSTEM FAULT</option>
                          </select>
                       </div>
                    </div>
                 </div>
               )}

               {modalType === "patient" && (
                 <div className="space-y-12">
                    <div className="space-y-6">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] ml-8 italic">Legal Identity</label>
                       <input required type="text" className="w-full px-12 py-10 rounded-[50px] border-4 border-slate-50 focus:border-primary outline-none text-4xl font-black italic shadow-inner" value={patientForm.name} onChange={e => setPatientForm({...patientForm, name: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-12">
                       <div className="space-y-6">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] ml-8 italic">Gender</label>
                          <select className="w-full px-12 py-10 rounded-[50px] border-4 border-slate-50 outline-none font-black bg-white italic shadow-sm" value={patientForm.gender} onChange={e => setPatientForm({...patientForm, gender: e.target.value})}>
                             <option value="Male">MALE</option>
                             <option value="Female">FEMALE</option>
                             <option value="Other">OTHER</option>
                          </select>
                       </div>
                       <div className="space-y-6">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] ml-8 italic">Blood Group</label>
                          <input type="text" className="w-full px-12 py-10 rounded-[50px] border-4 border-slate-50 focus:border-primary outline-none font-black text-xl italic" value={patientForm.bloodGroup} onChange={e => setPatientForm({...patientForm, bloodGroup: e.target.value})} />
                       </div>
                    </div>
                 </div>
               )}

               <button type="submit" className="w-full bg-secondary text-white py-12 rounded-[55px] font-black uppercase tracking-[0.3em] text-2xl flex items-center justify-center gap-8 hover:bg-primary transition-all shadow-[0_50px_100px_rgba(0,0,0,0.25)] active:scale-95 italic mt-12">
                  <ShieldCheck className="h-12 w-12 text-primary" /> Execute Protocol
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
