"use client";

import { useState, useMemo } from "react";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { branches } from "@/lib/data";
import {
  LayoutDashboard, Plus, Edit2, Trash2,
  Settings, X, CheckCircle, TrendingUp, Monitor, HardDrive, ShieldCheck, ClipboardList, Briefcase, Stethoscope, Beaker, Search, MapPin, RefreshCw, Users, AlertCircle, FileText, UserPlus, Activity, ArrowRight, Microscope
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminPage() {
  const {
    records, appointments, invoices, staff, equipment, auditLogs, patients, isSyncing,
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
  const [staffForm, setStaffForm] = useState<any>({ id: "", name: "", role: "Radiologist", branchId: branches[0].id, phone: "", email: "", status: "active" });
  const [equipForm, setEquipForm] = useState<any>({ id: "", name: "", type: "CT Scanner", branchId: branches[0].id, lastMaintenance: "", status: "operational" });
  const [patientForm, setPatientForm] = useState<any>({ id: "", name: "", email: "", phone: "", dob: "", gender: "Male", bloodGroup: "O+", history: [] });
  const [reportContent, setReportContent] = useState("");

  const handleOpenStaffModal = (member?: any) => {
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

  const handleOpenEquipModal = (item?: any) => {
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

  const handleOpenRecordModal = (record?: any) => {
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

  const handleOpenPatientModal = (pt?: any) => {
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

  const handleOpenReportModal = (apt: any) => {
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

  // FILTERED DATA WITH SEARCH
  const filteredAppointments = useMemo(() =>
    appointments.filter(a => {
      const matchesBranch = globalBranchFilter === "all" || a.branchId === globalBranchFilter;
      const matchesSearch = a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           a.scanName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesBranch && matchesSearch;
    }).sort((a, b) => {
      if (a.priority === "urgent" && b.priority !== "urgent") return -1;
      if (a.priority !== "urgent" && b.priority === "urgent") return 1;
      return 0;
    }),
    [appointments, globalBranchFilter, searchTerm]
  );

  const filteredStaff = useMemo(() =>
    staff.filter(s => {
      const matchesBranch = globalBranchFilter === "all" || s.branchId === globalBranchFilter;
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           s.role.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesBranch && matchesSearch;
    }),
    [staff, globalBranchFilter, searchTerm]
  );

  const filteredEquipment = useMemo(() =>
    equipment.filter(e => {
      const matchesBranch = globalBranchFilter === "all" || e.branchId === globalBranchFilter;
      const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           e.type.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesBranch && matchesSearch;
    }),
    [equipment, globalBranchFilter, searchTerm]
  );

  const filteredPatients = useMemo(() =>
    patients.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [patients, searchTerm]
  );

  const filteredRecords = useMemo(() =>
    records.filter(r =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [records, searchTerm]
  );

  const filteredLogs = useMemo(() =>
    auditLogs.filter(l =>
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.user.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [auditLogs, searchTerm]
  );

  const filteredInvoices = useMemo(() =>
    invoices.filter(i => {
      const branchObj = branches.find(b => b.name === i.branchName);
      const matchesBranch = globalBranchFilter === "all" || branchObj?.id === globalBranchFilter;
      const matchesSearch = i.patientName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesBranch && matchesSearch;
    }),
    [invoices, globalBranchFilter, searchTerm]
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
        name: b.name.includes("-") ? b.name.split("-")[1].trim() : b.name,
        rev: filteredInvoices.filter(i => i.branchName === b.name && i.status === "paid").reduce((acc, curr) => acc + curr.amount, 0)
      }))
    };
  }, [records, filteredAppointments, filteredInvoices, filteredStaff, filteredEquipment, patients]);

  const navItems = [
    { id: "dashboard", name: "Executive Suite", icon: LayoutDashboard, roles: ['ADMIN'] },
    { id: "reports", name: "Financial Intel", icon: TrendingUp, roles: ['ADMIN'] },
    { id: "analytics", name: "Clinical Analytics", icon: Activity, roles: ['ADMIN'], path: "/dashboard/admin/analytics" },
    { id: "lab-hub", name: "Laboratory Hub", icon: Beaker, roles: ['ADMIN', 'RADIOLOGIST'], path: "/dashboard/admin/lab" },
    { id: "appointments", name: "Clinical Pipeline", icon: ClipboardList, badge: stats.pendingAppointments, roles: ['ADMIN', 'RADIOLOGIST'] },
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
          {filteredNav.map((item: any) => (
            item.path ? (
              <Link key={item.id} href={item.path} className={cn(
                "w-full flex items-center justify-between px-5 py-4 rounded-[20px] transition-all duration-300",
                "text-slate-500 hover:text-white hover:bg-slate-800/50"
              )}>
                <div className="flex items-center gap-4">
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm font-bold uppercase tracking-widest text-[10px]">{item.name}</span>
                </div>
              </Link>
            ) : (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSearchTerm(""); }} className={cn(
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
            )
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
          <Link href="/dashboard/pos" className="w-full flex items-center justify-center gap-3 bg-primary/10 hover:bg-primary text-primary hover:text-white py-4 rounded-[25px] text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-primary/20">
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
                  {branches.map(b => <option key={b.id} value={b.id}>{b.name.includes("-") ? b.name.split("-")[1].trim().toUpperCase() : b.name.toUpperCase()}</option>)}
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
                  { label: "Aggregate Revenue", value: `GH₵${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
                  { label: "Unit Personnel", value: stats.staffCount, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Center Backlog", value: stats.pendingAppointments, icon: ClipboardList, color: "text-orange-600", bg: "bg-orange-50" },
                  { label: "Hardware Health", value: "99.9%", icon: ShieldCheck, color: "text-purple-600", bg: "bg-purple-50" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-8 rounded-[40px] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:scale-[1.05] transition-all cursor-default relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 group-hover:translate-x-4 transition-all"><stat.icon className="h-20 w-20" /></div>
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-inner relative z-10", stat.bg, stat.color)}>
                      <stat.icon className="h-7 w-7" />
                    </div>
                    <div className="relative z-10">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mb-2 italic">{stat.label}</p>
                      <p className="text-4xl font-black text-secondary tracking-tighter italic underline decoration-primary decoration-4 underline-offset-8">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 <div className="bg-white p-12 rounded-[50px] border border-white shadow-2xl">
                    <div className="flex justify-between items-center mb-12">
                       <h3 className="text-2xl font-black text-secondary tracking-tighter uppercase italic">Station Logistics</h3>
                       <button onClick={() => setActiveTab("inventory")} className="text-primary font-black text-[10px] uppercase tracking-[0.2em] hover:underline flex items-center gap-2 italic">Registry View <ArrowRight className="h-3 w-3" /></button>
                    </div>
                    <div className="space-y-6">
                       {filteredEquipment.slice(0, 4).map(e => (
                         <div key={e.id} className="group flex items-center justify-between p-7 rounded-[30px] bg-slate-50 hover:bg-white border-2 border-transparent hover:border-slate-100 transition-all shadow-sm hover:shadow-xl">
                            <div className="flex items-center gap-6">
                               <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-2xl", e.status === "operational" ? "bg-green-50 shadow-green-500/30" : "bg-orange-500")}>
                                  <HardDrive className="h-7 w-7" />
                               </div>
                               <div>
                                  <p className="font-black text-secondary text-base italic uppercase">{e.name}</p>
                                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">{e.type} • {branches.find(b => b.id === e.branchId)?.name.includes("-") ? branches.find(b => b.id === e.branchId)?.name.split("-")[1].trim() : branches.find(b => b.id === e.branchId)?.name}</p>
                               </div>
                            </div>
                            <span className={cn("text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border", e.status === "operational" ? "bg-green-50 text-green-600 border-green-100" : "bg-orange-50 text-orange-600 border-orange-100")}>{e.status}</span>
                         </div>
                       ))}
                       {filteredEquipment.length === 0 && <p className="text-center text-slate-400 font-bold uppercase italic py-10">No hardware assigned to this node.</p>}
                    </div>
                 </div>

                 <div className="bg-secondary p-12 rounded-[50px] text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-16 opacity-5 scale-150 rotate-45 pointer-events-none italic font-black text-9xl">GRACE</div>
                    <div className="relative z-10 h-full flex flex-col">
                       <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-12 flex items-center gap-3 underline decoration-primary decoration-4">Revenue Intel <Activity className="h-6 w-6 text-primary" /></h3>
                       <div className="space-y-12 flex-grow">
                          {stats.branchBreakdown.filter(b => {
                            if (globalBranchFilter === "all") return true;
                            const br = branches.find(branch => branch.id === globalBranchFilter);
                            const name = br?.name.includes("-") ? br.name.split("-")[1].trim() : br?.name;
                            return b.name.toUpperCase() === name?.toUpperCase();
                          }).map((b, i) => (
                            <div key={i} className="space-y-4">
                               <div className="flex justify-between items-end">
                                  <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 italic">{b.name}</p>
                                  <p className="text-4xl font-black text-primary italic tracking-tighter">GH₵{b.rev.toLocaleString()}</p>
                               </div>
                               <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700 p-0.5">
                                  <div className="h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_15px_#C8A97E]" style={{ width: stats.totalRevenue > 0 ? `${(b.rev / stats.totalRevenue) * 100}%` : '0%' }} />
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
                              <span className="text-secondary font-black">GH₵{item.rev.toLocaleString()}</span>
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

          {/* SHARED SEARCH HEADER FOR TABS */}
          {["appointments", "patients", "staff", "body-parts", "inventory", "logs"].includes(activeTab) && (
            <div className="bg-white rounded-[50px] shadow-2xl border border-white overflow-hidden animate-in fade-in zoom-in duration-500 mb-10">
               <div className="p-10 border-b bg-slate-50/30 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="relative flex-grow max-w-2xl">
                     <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                     <input
                       type="text"
                       placeholder={`Lookup ${activeTab.replace("-", " ")}...`}
                       className="w-full pl-16 pr-6 py-5 rounded-[25px] border-2 border-slate-100 focus:border-primary outline-none font-bold text-lg italic shadow-inner transition-all"
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                     />
                  </div>
                  <div className="flex gap-4">
                     {activeTab === "patients" && <button onClick={() => handleOpenPatientModal()} className="bg-secondary text-white px-8 py-5 rounded-[25px] font-black uppercase tracking-widest text-[10px] flex items-center gap-3"><UserPlus className="h-4 w-4" /> Enroll</button>}
                     {activeTab === "staff" && <button onClick={() => handleOpenStaffModal()} className="bg-secondary text-white px-8 py-5 rounded-[25px] font-black uppercase tracking-widest text-[10px] flex items-center gap-3"><Plus className="h-4 w-4" /> Recruit</button>}
                     {activeTab === "inventory" && <button onClick={() => handleOpenEquipModal()} className="bg-secondary text-white px-8 py-5 rounded-[25px] font-black uppercase tracking-widest text-[10px] flex items-center gap-3"><Plus className="h-4 w-4" /> Register</button>}
                     {activeTab === "body-parts" && <button onClick={() => handleOpenRecordModal()} className="bg-primary text-white px-8 py-5 rounded-[25px] font-black uppercase tracking-widest text-[10px] flex items-center gap-3 shadow-lg shadow-primary/20"><Plus className="h-4 w-4" /> Define</button>}
                  </div>
               </div>

               <div className="overflow-x-auto">
                 {activeTab === "appointments" && (
                   <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">
                          <th className="px-12 py-8">Case ID</th>
                          <th className="px-12 py-8">Clinical Group</th>
                          <th className="px-12 py-8 text-center">Verification Status</th>
                          <th className="px-12 py-8 text-right">Ops</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredAppointments.map(apt => (
                          <tr key={apt.id} className={cn("hover:bg-primary/[0.01] transition-all group", apt.priority === 'urgent' && "bg-red-50/30")}>
                            <td className="px-12 py-8">
                               <div className="flex items-center gap-4">
                                  {apt.priority === 'urgent' && <AlertCircle className="h-5 w-5 text-red-500 animate-pulse" />}
                                  <div>
                                     <p className="font-black text-secondary text-base italic uppercase underline decoration-slate-100 group-hover:decoration-primary group-hover:text-primary transition-all">{apt.patientName}</p>
                                     <div className="flex items-center gap-2 mt-2">
                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{branches.find(b => b.id === apt.branchId)?.name.includes("-") ? branches.find(b => b.id === apt.branchId)?.name.split("-")[1].trim() : branches.find(b => b.id === apt.branchId)?.name}</span>
                                        <span className="text-slate-200">•</span>
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">{apt.date}</span>
                                        {apt.referringDoctor && (
                                          <>
                                            <span className="text-slate-200">•</span>
                                            <span className="text-[9px] font-black text-primary uppercase tracking-widest italic flex items-center gap-1"><Stethoscope className="h-3 w-3" /> {apt.referringDoctor}</span>
                                          </>
                                        )}
                                     </div>
                                  </div>
                               </div>
                            </td>
                            <td className="px-12 py-8">
                               <span className="text-xs font-black uppercase tracking-[0.1em] text-slate-500 italic">{apt.scanName}</span>
                               {apt.priority === 'urgent' && <span className="ml-3 px-2 py-0.5 bg-red-100 text-red-600 text-[8px] font-black uppercase tracking-widest rounded-full">STAT</span>}
                            </td>
                            <td className="px-12 py-8 text-center">
                               {apt.reportAttached ? (
                                 <span className="inline-flex items-center gap-3 text-green-600 text-[10px] font-black uppercase italic"><ShieldCheck className="h-5 w-5" /> Result Attested</span>
                               ) : (
                                 <button onClick={() => handleOpenReportModal(apt)} className={cn("hover:text-secondary px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all border", apt.priority === 'urgent' ? "bg-red-500 text-white border-red-600" : "bg-primary/5 text-primary border-primary/10")}>Verification Pending</button>
                               )}
                            </td>
                            <td className="px-12 py-8 text-right">
                               <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                  <button onClick={() => updateAppointment(apt.id, "confirmed")} className="p-4 bg-white border shadow-xl rounded-2xl hover:bg-green-600 hover:text-white transition-all"><CheckCircle className="h-5 w-5" /></button>
                                  <button className="p-4 bg-white border shadow-xl rounded-2xl hover:bg-secondary hover:text-white transition-all"><FileText className="h-5 w-5" /></button>
                               </div>
                            </td>
                          </tr>
                        ))}
                        {filteredAppointments.length === 0 && <tr><td colSpan={4} className="py-32 text-center text-slate-300 font-black uppercase tracking-[0.5em] italic">Station Clear • No Active Cases</td></tr>}
                      </tbody>
                   </table>
                 )}

                 {activeTab === "patients" && (
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
                        {filteredPatients.map(pt => (
                          <tr key={pt.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-12 py-8">
                               <p className="font-black text-secondary text-base italic uppercase">{pt.name}</p>
                               <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.1em] mt-2">{pt.gender} • DOB: {pt.dob}</p>
                            </td>
                            <td className="px-12 py-8"><span className="text-xs font-black uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 italic shadow-sm shadow-primary/5">Blood: {pt.bloodGroup}</span></td>
                            <td className="px-12 py-8 text-xs font-black text-slate-500 uppercase tracking-widest">{pt.phone}</td>
                            <td className="px-12 py-8 text-right"><button onClick={() => handleOpenPatientModal(pt)} className="p-4 bg-slate-100 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm group-hover:shadow-lg"><Edit2 className="h-4 w-4" /></button></td>
                          </tr>
                        ))}
                        {filteredPatients.length === 0 && <tr><td colSpan={4} className="py-32 text-center text-slate-300 font-black uppercase tracking-[0.5em] italic">EHR Repository Empty</td></tr>}
                      </tbody>
                   </table>
                 )}

                 {activeTab === "staff" && (
                    <table className="w-full text-left">
                       <thead>
                         <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">
                           <th className="px-12 py-8">Employee identity</th>
                           <th className="px-12 py-8 text-center">Grade</th>
                           <th className="px-12 py-8 text-center">Station</th>
                           <th className="px-12 py-8 text-right">Ops</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                         {filteredStaff.map(s => (
                           <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                             <td className="px-12 py-8">
                                <p className="font-black text-secondary text-base italic uppercase">{s.name}</p>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.1em] mt-1">{s.email}</p>
                             </td>
                             <td className="px-12 py-8 text-center"><span className="text-xs font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200">{s.role}</span></td>
                             <td className="px-12 py-8 text-center text-xs font-black text-primary italic uppercase tracking-tighter">{branches.find(b => b.id === s.branchId)?.name.includes("-") ? branches.find(b => b.id === s.branchId)?.name.split("-")[1].trim() : branches.find(b => b.id === s.branchId)?.name}</td>
                             <td className="px-12 py-8 text-right">
                                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                   <button onClick={() => handleOpenStaffModal(s)} className="p-4 bg-white border shadow-sm rounded-2xl hover:bg-primary hover:text-white transition-all"><Edit2 className="h-4 w-4" /></button>
                                   <button onClick={() => deleteStaff(s.id)} className="p-4 bg-white border shadow-sm rounded-2xl hover:bg-red-500 hover:text-white transition-all text-red-500"><Trash2 className="h-4 w-4" /></button>
                                </div>
                             </td>
                           </tr>
                         ))}
                         {filteredStaff.length === 0 && <tr><td colSpan={4} className="py-32 text-center text-slate-300 font-black uppercase tracking-[0.5em] italic">No active personnel matching query</td></tr>}
                       </tbody>
                    </table>
                 )}

                 {activeTab === "body-parts" && (
                    <table className="w-full text-left">
                       <thead>
                         <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">
                           <th className="px-12 py-8">Procedure</th>
                           <th className="px-12 py-8 text-center">Fee (GH₵)</th>
                           <th className="px-12 py-8 text-right">Ops</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                         {filteredRecords.map(r => (
                           <tr key={r.id} className="hover:bg-slate-50 transition-colors group">
                             <td className="px-12 py-8 font-black text-secondary text-base italic uppercase">{r.name}</td>
                             <td className="px-12 py-8 text-center font-black text-secondary text-2xl tracking-tighter italic">GH₵{r.price.toLocaleString()}</td>
                             <td className="px-12 py-8 text-right">
                                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                   <button onClick={() => handleOpenRecordModal(r)} className="p-4 bg-white border shadow-sm rounded-2xl hover:bg-secondary hover:text-white transition-all"><Edit2 className="h-4 w-4" /></button>
                                   <button onClick={() => deleteRecord(r.id)} className="p-4 bg-white border shadow-sm rounded-2xl hover:bg-red-500 hover:text-white transition-all text-red-500"><Trash2 className="h-4 w-4" /></button>
                                </div>
                             </td>
                           </tr>
                         ))}
                         {filteredRecords.length === 0 && <tr><td colSpan={3} className="py-32 text-center text-slate-300 font-black uppercase tracking-[0.5em] italic">Service catalog clear</td></tr>}
                       </tbody>
                    </table>
                 )}

                 {activeTab === "inventory" && (
                    <table className="w-full text-left">
                       <thead>
                         <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">
                           <th className="px-12 py-8">Hardware identity</th>
                           <th className="px-12 py-8 text-center">Status</th>
                           <th className="px-12 py-8 text-right">Ops</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                         {filteredEquipment.map(e => (
                           <tr key={e.id} className="hover:bg-slate-50 transition-colors group">
                             <td className="px-12 py-8 font-black text-secondary text-base italic uppercase">{e.name}</td>
                             <td className="px-12 py-8 text-center"><span className={cn("px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border", e.status === "operational" ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100")}>{e.status}</span></td>
                             <td className="px-12 py-8 text-right">
                                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                   <button onClick={() => handleOpenEquipModal(e)} className="p-4 bg-white border shadow-sm rounded-2xl hover:bg-primary hover:text-white transition-all"><Edit2 className="h-4 w-4" /></button>
                                   <button onClick={() => deleteEquipment(e.id)} className="p-4 bg-white border shadow-sm rounded-2xl hover:bg-red-500 hover:text-white transition-all text-red-500"><Trash2 className="h-4 w-4" /></button>
                                </div>
                             </td>
                           </tr>
                         ))}
                         {filteredEquipment.length === 0 && <tr><td colSpan={3} className="py-32 text-center text-slate-300 font-black uppercase tracking-[0.5em] italic">Asset registry clear</td></tr>}
                       </tbody>
                    </table>
                 )}

                 {activeTab === "logs" && (
                    <div className="p-10 space-y-4">
                       {filteredLogs.map(log => (
                         <div key={log.id} className="flex items-center gap-10 p-10 rounded-[40px] bg-slate-50 border-2 border-slate-100 transition-all hover:bg-white hover:shadow-2xl hover:-translate-y-1 group">
                            <div className="w-32 font-black text-slate-300 font-mono text-xs italic tracking-tighter">{log.timestamp.split(",")[1]}</div>
                            <div className="w-44 shrink-0"><span className="px-5 py-2 bg-primary/10 text-primary rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] border border-primary/20">{log.module}</span></div>
                            <div className="flex-grow font-black text-secondary text-sm group-hover:text-primary transition-colors italic tracking-tight">{log.action}</div>
                         </div>
                       ))}
                       {filteredLogs.length === 0 && <p className="py-32 text-center text-slate-300 font-black uppercase tracking-[0.5em] italic">No audit events logged.</p>}
                    </div>
                 )}
               </div>
            </div>
          )}
        </div>
      </main>

      {/* Enterprise Integrated Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-secondary/95 backdrop-blur-3xl z-[200] flex items-center justify-center p-6">
          <div className="bg-white rounded-[70px] shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-20 duration-700 border-[12px] border-white/50 relative">
            <div className="absolute top-0 right-0 p-16 opacity-5 scale-150 rotate-45 pointer-events-none"><ShieldCheck className="h-60 w-60 text-primary" /></div>
            <div className="p-20 border-b bg-slate-50/50 flex justify-between items-center relative z-10">
               <div>
                  <h3 className="text-6xl font-black text-secondary tracking-tighter uppercase italic underline decoration-primary decoration-[12px] underline-offset-[12px]">{editingItem ? "Update" : "Registry"}</h3>
                  <p className="text-[11px] text-primary font-black uppercase tracking-[0.8em] mt-12 ml-4 italic">Verification Protocol 4.01-X</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="p-8 bg-white rounded-[40px] shadow-2xl text-slate-200 hover:text-red-500 active:scale-75 transition-all relative z-10 border-2 border-slate-50"><X className="h-12 w-12" /></button>
            </div>

            <form onSubmit={handleSave} className="p-20 space-y-16 overflow-y-auto max-h-[60vh] custom-scrollbar relative z-10">
               {modalType === "report" && (
                 <div className="space-y-12">
                    <div className="p-12 rounded-[50px] bg-blue-50 border-4 border-blue-100 italic relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform"><Microscope className="h-32 w-32" /></div>
                       <p className="text-xs font-black text-blue-400 uppercase tracking-[0.5em] mb-6 flex items-center gap-3 relative z-10 italic">Clinical Intelligence</p>
                       <p className="text-5xl font-black text-blue-900 tracking-tighter uppercase leading-none relative z-10">{editingItem.patientName}</p>
                       <p className="text-sm font-bold text-blue-700 mt-6 relative z-10 italic">{editingItem.scanName} • Pipeline Node: #{editingItem.id}</p>
                    </div>
                    <div className="space-y-6">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] ml-8 italic font-black">Clinical Impression</label>
                       <textarea required rows={5} className="w-full px-12 py-10 rounded-[50px] border-4 border-slate-50 focus:border-primary outline-none font-black text-2xl italic bg-slate-50/50 shadow-inner resize-none transition-all tracking-tighter" placeholder="SYNTHESIZE RESULT..." value={reportContent} onChange={e => setReportContent(e.target.value)} />
                    </div>
                 </div>
               )}

               {modalType === "staff" && (
                 <div className="space-y-12">
                   <div className="space-y-6">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] ml-8 italic font-black">Legal Identity</label>
                      <input required type="text" className="w-full px-12 py-10 rounded-[50px] border-4 border-slate-50 focus:border-primary outline-none text-4xl font-black italic shadow-inner bg-slate-50/30 tracking-tighter" value={staffForm.name} onChange={e => setStaffForm({...staffForm, name: e.target.value})} />
                   </div>
                   <div className="grid grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] ml-8 italic font-black">Node</label>
                        <select className="w-full px-12 py-10 rounded-[50px] border-4 border-slate-50 focus:border-primary outline-none font-black text-xl bg-white appearance-none italic shadow-sm tracking-tighter" value={staffForm.branchId} onChange={e => setStaffForm({...staffForm, branchId: e.target.value})}>
                           {branches.map(b => <option key={b.id} value={b.id}>{b.name.includes("-") ? b.name.split("-")[1].trim().toUpperCase() : b.name.toUpperCase()}</option>)}
                        </select>
                      </div>
                      <div className="space-y-6">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] ml-8 italic font-black">Grade</label>
                        <select className="w-full px-12 py-10 rounded-[50px] border-4 border-slate-50 focus:border-primary outline-none font-black text-xl bg-white appearance-none italic shadow-sm tracking-tighter" value={staffForm.role} onChange={e => setStaffForm({...staffForm, role: e.target.value as any})}>
                           {["Radiologist", "Doctor", "Nurse", "Receptionist", "Admin"].map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
                        </select>
                      </div>
                   </div>
                 </div>
               )}

               {modalType === "record" && (
                 <div className="space-y-12">
                   <div className="space-y-6">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] ml-8 italic font-black">Protocol Name</label>
                      <input required type="text" className="w-full px-12 py-10 rounded-[50px] border-4 border-slate-50 focus:border-primary outline-none text-4xl font-black italic shadow-inner bg-slate-50/30 tracking-tighter" value={recordForm.name} onChange={e => setRecordRecordForm({...recordForm, name: e.target.value})} />
                   </div>
                   <div className="grid grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] ml-8 italic font-black">Unit Fee (GH₵)</label>
                        <input type="number" className="w-full px-12 py-10 rounded-[50px] border-4 border-slate-50 focus:border-primary outline-none font-black text-4xl italic text-primary tracking-tighter shadow-sm" value={recordForm.price} onChange={e => setRecordRecordForm({...recordForm, price: parseInt(e.target.value) || 0})} />
                      </div>
                      <div className="space-y-6">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] ml-8 italic font-black">Time</label>
                        <input type="text" className="w-full px-12 py-10 rounded-[50px] border-4 border-slate-50 focus:border-primary outline-none font-black text-2xl italic tracking-tighter shadow-sm" value={recordForm.duration} onChange={e => setRecordRecordForm({...recordForm, duration: e.target.value})} />
                      </div>
                   </div>
                 </div>
               )}

               {modalType === "equipment" && (
                 <div className="space-y-12">
                    <div className="space-y-6">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] ml-8 italic font-black">Hardware Serial</label>
                       <input required type="text" className="w-full px-12 py-10 rounded-[50px] border-4 border-slate-50 focus:border-primary outline-none text-4xl font-black italic shadow-inner bg-slate-50/30 tracking-tighter" value={equipForm.name} onChange={e => setEquipForm({...equipForm, name: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-12">
                       <div className="space-y-6">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] ml-8 italic font-black">Node</label>
                          <select className="w-full px-12 py-10 rounded-[50px] border-4 border-slate-50 focus:border-primary outline-none font-black text-xl bg-white appearance-none italic shadow-sm tracking-tighter" value={equipForm.branchId} onChange={e => setEquipForm({...equipForm, branchId: e.target.value})}>
                             {branches.map(b => <option key={b.id} value={b.id}>{b.name.includes("-") ? b.name.split("-")[1].trim().toUpperCase() : b.name.toUpperCase()}</option>)}
                          </select>
                       </div>
                       <div className="space-y-6">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] ml-8 italic font-black">Health</label>
                          <select className="w-full px-12 py-10 rounded-[50px] border-4 border-slate-50 focus:border-primary outline-none font-black text-xl bg-white appearance-none italic shadow-sm tracking-tighter" value={equipForm.status} onChange={e => setEquipForm({...equipForm, status: e.target.value as any})}>
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
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] ml-8 italic font-black">Legal Identity</label>
                       <input required type="text" className="w-full px-12 py-10 rounded-[50px] border-4 border-slate-50 focus:border-primary outline-none text-4xl font-black italic shadow-inner bg-slate-50/30 tracking-tighter" value={patientForm.name} onChange={e => setPatientForm({...patientForm, name: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-12">
                       <div className="space-y-6">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] ml-8 italic font-black">Gender</label>
                          <select className="w-full px-12 py-10 rounded-[50px] border-4 border-slate-50 outline-none font-black bg-white italic shadow-sm tracking-tighter appearance-none" value={patientForm.gender} onChange={e => setPatientForm({...patientForm, gender: e.target.value})}>
                             <option value="Male">MALE</option>
                             <option value="Female">FEMALE</option>
                             <option value="Other">OTHER</option>
                          </select>
                       </div>
                       <div className="space-y-6">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] ml-8 italic font-black">Blood Group</label>
                          <input type="text" className="w-full px-12 py-10 rounded-[50px] border-4 border-slate-50 focus:border-primary outline-none font-black text-2xl italic tracking-tighter shadow-sm bg-white" value={patientForm.bloodGroup} onChange={e => setPatientForm({...patientForm, bloodGroup: e.target.value})} />
                       </div>
                    </div>
                 </div>
               )}

               <button type="submit" className="w-full bg-secondary text-white py-12 rounded-[55px] font-black uppercase tracking-[0.3em] text-2xl flex items-center justify-center gap-8 hover:bg-primary transition-all shadow-[0_50px_100px_rgba(0,0,0,0.25)] active:scale-95 italic">
                  <ShieldCheck className="h-12 w-12 text-primary shadow-[0_0_20px_#C8A97E]" /> Attest Entry
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
