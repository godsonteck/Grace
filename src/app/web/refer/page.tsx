"use client";

import { useState } from "react";
import {
  Stethoscope, ShieldCheck, Mail, Phone, MapPin, ArrowRight, CheckCircle2, ClipboardList
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReferralPortalPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    facility: "",
    email: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsSuccess(true);
      } else {
        throw new Error("API Failure");
      }
    } catch (error) {
      alert("Registration failure. Please contact Grace Diagnostic HQ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
         <div className="max-w-2xl w-full bg-white rounded-[60px] shadow-2xl p-16 text-center border-[12px] border-slate-100">
            <div className="w-24 h-24 bg-green-50 text-green-500 rounded-[35px] flex items-center justify-center mx-auto mb-10 shadow-xl shadow-green-500/10 rotate-3 border-2 border-green-100">
               <CheckCircle2 className="h-12 w-12" />
            </div>
            <h1 className="text-4xl font-black text-secondary tracking-tighter uppercase italic underline decoration-primary decoration-8 underline-offset-8 mb-8">Registry Confirmed</h1>
            <p className="text-slate-400 text-lg font-medium italic mb-12">
               Welcome to the Grace Clinical Network, Dr. {formData.name.split(" ").pop()}. Your credentials have been synchronized across our diagnostic nodes.
            </p>
            <div className="p-8 bg-slate-50 rounded-[40px] border-2 border-slate-100 mb-12">
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 italic">Next Steps</p>
               <p className="text-sm font-bold text-secondary italic">You may now proceed to refer patients by including your name on their booking requests.</p>
            </div>
            <button
              onClick={() => window.location.href = "/"}
              className="bg-secondary text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs transition-all shadow-2xl active:scale-95"
            >
               Exit Portal
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center bg-secondary overflow-hidden">
         <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-12 gap-4 p-8">
               {Array.from({length: 48}).map((_, i) => (
                 <div key={i} className="h-24 bg-white/20 rounded-full rotate-45" />
               ))}
            </div>
         </div>
         <div className="relative z-10 text-center px-4 max-w-4xl">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/20 rounded-full border border-primary/30 mb-8 backdrop-blur-md">
               <Stethoscope className="h-5 w-5 text-primary" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">Clinical Partnership Gateway</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic mb-8">Medical <span className="text-primary not-italic">Referrals</span></h1>
            <p className="text-xl text-slate-400 font-medium italic">Empowering practitioners with precision diagnostic intelligence.</p>
         </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 -mt-20 relative z-20 pb-32">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Benefits */}
            <div className="lg:col-span-1 space-y-8">
               <div className="p-10 rounded-[50px] bg-white shadow-2xl border-2 border-slate-50 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform"><ClipboardList className="h-24 w-24 text-primary" /></div>
                  <h3 className="text-2xl font-black text-secondary tracking-tighter uppercase italic mb-8 underline decoration-primary decoration-4 underline-offset-4">Provider Perks</h3>
                  <div className="space-y-6">
                     {[
                       { t: "Priority Pipeline", d: "Referrals are processed with 15% faster latency in our clinical queue." },
                       { t: "Digital Sync", d: "Direct access to full-fidelity images via our secure consultant uplink." },
                       { t: "Consultant Support", d: "24/7 dedicated medical hotline for report clarification." }
                     ].map((item, i) => (
                       <div key={i} className="space-y-2">
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest italic">{item.t}</p>
                          <p className="text-slate-500 text-sm italic font-medium leading-relaxed">{item.d}</p>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="p-10 rounded-[50px] bg-secondary text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 p-10 opacity-5 scale-150 rotate-45 pointer-events-none italic font-black text-6xl">GRACE</div>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter mb-6 flex items-center gap-3">Network Integrity <ShieldCheck className="h-5 w-5 text-primary" /></h3>
                  <p className="text-slate-400 text-sm italic leading-relaxed">
                     By joining the Grace Referral Network, you become part of a synchronized diagnostic ecosystem committed to "Fast, Clear, and Accurate" medicine.
                  </p>
               </div>
            </div>

            {/* Registration Form */}
            <div className="lg:col-span-2">
               <div className="bg-white rounded-[60px] shadow-[0_50px_150px_rgba(0,0,0,0.15)] border-[12px] border-slate-50 overflow-hidden">
                  <div className="p-16 border-b bg-slate-50/50 flex justify-between items-center">
                     <div>
                        <h3 className="text-4xl font-black text-secondary tracking-tighter uppercase italic">Enrollment Form</h3>
                        <p className="text-[10px] text-primary font-black uppercase tracking-[0.5em] mt-8 italic">New Practitioner Registration</p>
                     </div>
                  </div>

                  <form onSubmit={handleSubmit} className="p-16 space-y-12">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Full Identity</label>
                           <div className="relative">
                              <Stethoscope className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-200" />
                              <input required type="text" className="w-full pl-16 pr-8 py-6 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white outline-none font-bold text-lg italic shadow-inner transition-all" placeholder="DR. KOFI..." value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                           </div>
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Medical Facility</label>
                           <div className="relative">
                              <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-200" />
                              <input required type="text" className="w-full pl-16 pr-8 py-6 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white outline-none font-bold text-lg italic shadow-inner transition-all" placeholder="SITE LOCATION..." value={formData.facility} onChange={e => setFormData({...formData, facility: e.target.value})} />
                           </div>
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Electronic Node (Email)</label>
                           <div className="relative">
                              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-200" />
                              <input required type="email" className="w-full pl-16 pr-8 py-6 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white outline-none font-bold text-lg italic shadow-inner transition-all" placeholder="DR@CLINIC.COM" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                           </div>
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Contact Node (Phone)</label>
                           <div className="relative">
                              <Phone className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-200" />
                              <input required type="tel" className="w-full pl-16 pr-8 py-6 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white outline-none font-bold text-lg italic shadow-inner transition-all" placeholder="+233..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                           </div>
                        </div>
                     </div>

                     <button
                       type="submit"
                       disabled={isSubmitting}
                       className="w-full bg-secondary text-white py-10 rounded-[45px] font-black uppercase tracking-[0.3em] text-xl flex items-center justify-center gap-6 hover:bg-primary transition-all shadow-2xl active:scale-95 italic"
                     >
                        {isSubmitting ? "ATTESTING PROTOCOL..." : (
                          <>
                             <ShieldCheck className="h-10 w-10 text-primary shadow-[0_0_20px_#C8A97E]" /> Attest Registration <ArrowRight className="h-6 w-6" />
                          </>
                        )}
                     </button>
                  </form>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
