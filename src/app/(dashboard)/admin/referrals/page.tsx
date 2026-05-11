"use client";

import { useState, useMemo, useEffect } from "react";
import { useData } from "@/context/DataContext";
import {
  Stethoscope, Plus, ShieldCheck, X, Search, Filter, ArrowRight
} from "lucide-react";

export default function ReferralsPage() {
  const { appointments } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [partners, setPartners] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: "", facility: "", phone: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPartners = async () => {
    try {
      const res = await fetch('/api/referrals');
      if (res.ok) setPartners(await res.json());
    } catch (_error) {
      console.error("Failed to fetch partner directory.");
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const referralStats = useMemo(() => {
    const counts: Record<string, number> = {};
    appointments.forEach(apt => {
      if (apt.referringDoctor) {
        counts[apt.referringDoctor] = (counts[apt.referringDoctor] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [appointments]);

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        fetchPartners();
        setIsModalOpen(false);
        setFormData({ name: "", facility: "", phone: "", email: "" });
      }
    } catch (_error) {
       alert("Failed to enroll partner.");
    } finally {
       setIsSubmitting(false);
    }
  };

  const filteredReferrals = useMemo(() => {
    const registry = partners.map(p => ({
      name: p.name,
      facility: p.facility,
      count: referralStats.find(s => s.name === p.name)?.count || 0,
      phone: p.phone,
      email: p.email
    }));

    return registry.filter(r =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.facility?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [partners, referralStats, searchTerm]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="flex justify-between items-end mb-16">
          <div>
            <h1 className="text-5xl font-black text-secondary tracking-tighter uppercase italic underline decoration-primary decoration-8 underline-offset-8">Referral Intelligence</h1>
            <p className="text-slate-400 text-lg mt-8 font-medium italic">Track and manage your medical professional network and case distributions.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-secondary text-white px-10 py-5 rounded-[25px] font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-primary transition-all shadow-xl shadow-secondary/10"
          >
            <Plus className="h-5 w-5" /> Enroll Doctor
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Summary Cards */}
           <div className="lg:col-span-1 space-y-8">
              <div className="bg-white p-10 rounded-[45px] border border-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform"><Stethoscope className="h-24 w-24 text-primary" /></div>
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 italic">Total Referral Partners</h3>
                 <p className="text-6xl font-black text-secondary tracking-tighter italic">{referralStats.length}</p>
                 <div className="mt-8 pt-8 border-t border-slate-50">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest italic flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Active Network Node</p>
                 </div>
              </div>

              <div className="bg-secondary p-10 rounded-[45px] text-white shadow-2xl">
                 <h3 className="text-xl font-black uppercase italic tracking-tighter mb-8 flex items-center gap-3">Top Contributors <Filter className="h-5 w-5 text-primary" /></h3>
                 <div className="space-y-6">
                    {referralStats.slice(0, 5).map((r, i) => (
                      <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/10 italic">
                         <span className="font-bold text-sm uppercase">{r.name}</span>
                         <span className="bg-primary px-3 py-1 rounded-full text-[10px] font-black">{r.count} CASES</span>
                      </div>
                    ))}
                    {referralStats.length === 0 && <p className="text-center text-slate-500 font-black uppercase tracking-widest italic py-8 text-xs">No referral data archived.</p>}
                 </div>
              </div>
           </div>

           {/* Partner Table */}
           <div className="lg:col-span-2 bg-white rounded-[50px] shadow-2xl border border-white overflow-hidden">
              <div className="p-10 border-b bg-slate-50/30">
                 <div className="relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <input
                      type="text"
                      placeholder="Lookup medical partner..."
                      className="w-full pl-16 pr-6 py-5 rounded-[25px] border-2 border-slate-100 focus:border-primary outline-none font-bold text-lg italic shadow-inner transition-all"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">
                          <th className="px-12 py-8">Practitioner</th>
                          <th className="px-12 py-8 text-center">Case Volume</th>
                          <th className="px-12 py-8 text-center">Contact Node</th>
                          <th className="px-12 py-8 text-right">Integrity</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {filteredReferrals.map((r, i) => (
                         <tr key={i} className="hover:bg-primary/[0.01] transition-all group">
                            <td className="px-12 py-8">
                               <p className="font-black text-secondary text-base italic uppercase">{r.name}</p>
                               <p className="text-[10px] font-black text-primary uppercase tracking-[0.1em] mt-1">{r.facility || "Independent Clinic"}</p>
                            </td>
                            <td className="px-12 py-8 text-center">
                               <span className="text-2xl font-black text-primary italic tracking-tighter">{r.count}</span>
                               <span className="ml-2 text-[9px] font-black text-slate-300 uppercase tracking-widest">Units</span>
                            </td>
                            <td className="px-12 py-8 text-center">
                               <p className="text-xs font-black text-slate-500 uppercase italic">{r.phone || "N/A"}</p>
                               <p className="text-[9px] text-slate-300 font-bold lowercase">{r.email || "no-sync@clinical.node"}</p>
                            </td>
                            <td className="px-12 py-8 text-right">
                               <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl text-[9px] font-black uppercase italic border border-green-100">
                                  <ShieldCheck className="h-4 w-4" /> Verified Partner
                               </div>
                            </td>
                         </tr>
                       ))}
                       {filteredReferrals.length === 0 && (
                         <tr><td colSpan={3} className="py-32 text-center text-slate-300 font-black uppercase tracking-[0.5em] italic">No practitioners matching query.</td></tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      </div>

      {/* Enroll Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-secondary/95 backdrop-blur-3xl z-[200] flex items-center justify-center p-6">
          <div className="bg-white rounded-[70px] shadow-2xl w-full max-w-2xl overflow-hidden border-[12px] border-white/50 relative">
             <div className="p-16 border-b bg-slate-50/50 flex justify-between items-center">
                <div>
                   <h3 className="text-4xl font-black text-secondary tracking-tighter uppercase italic underline decoration-primary decoration-8 underline-offset-8">Partner Registry</h3>
                   <p className="text-[10px] text-primary font-black uppercase tracking-[0.5em] mt-8 italic">New Clinical Connection</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-6 bg-white rounded-3xl shadow-xl text-slate-300 hover:text-red-500 transition-all border border-slate-100"><X className="h-8 w-8" /></button>
             </div>
             <form onSubmit={handleEnroll} className="p-16 space-y-12">
                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] ml-8 italic font-black">Practitioner Name</label>
                      <input required type="text" className="w-full px-8 py-6 rounded-[30px] border-4 border-slate-50 focus:border-primary outline-none text-lg font-black italic shadow-inner bg-slate-50/30 tracking-tighter" placeholder="DR. SAMUEL..." value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] ml-8 italic font-black">Medical Facility</label>
                      <input required type="text" className="w-full px-8 py-6 rounded-[30px] border-4 border-slate-50 focus:border-primary outline-none text-lg font-black italic shadow-inner bg-slate-50/30 tracking-tighter" placeholder="GENERAL HOSPITAL..." value={formData.facility} onChange={e => setFormData({...formData, facility: e.target.value})} />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] ml-8 italic font-black">Contact Node (Phone)</label>
                      <input required type="text" className="w-full px-8 py-6 rounded-[30px] border-4 border-slate-50 focus:border-primary outline-none text-lg font-black italic shadow-inner bg-slate-50/30 tracking-tighter" placeholder="0555..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] ml-8 italic font-black">Electronic Node (Email)</label>
                      <input required type="email" className="w-full px-8 py-6 rounded-[30px] border-4 border-slate-50 focus:border-primary outline-none text-lg font-black italic shadow-inner bg-slate-50/30 tracking-tighter" placeholder="dr@clinic.node" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                   </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-secondary text-white py-10 rounded-[45px] font-black uppercase tracking-[0.3em] text-xl flex items-center justify-center gap-6 hover:bg-primary transition-all shadow-2xl active:scale-95 italic"
                >
                   {isSubmitting ? "ATTESTING..." : (
                     <>
                        <ShieldCheck className="h-10 w-10 text-primary" /> Attest Partner
                     </>
                   )}
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
