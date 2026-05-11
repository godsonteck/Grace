"use client";

import { branches } from "@/lib/data";
import { Mail, MapPin, ShieldCheck, Phone, Map, ArrowRight, ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";

export default function ContactPage() {
  const [selectedBranchId, setSelectedBranchId] = useState("all");
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSuccess] = useState(false);

  const selectedBranch = useMemo(() =>
    branches.find(b => b.id === selectedBranchId),
    [selectedBranchId]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulated send
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormState({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero */}
      <section className="relative h-[40vh] flex items-center justify-center bg-secondary overflow-hidden">
         <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 gap-4 p-8">
               {Array.from({length: 32}).map((_, i) => (
                 <div key={i} className="h-20 bg-white/20 rounded-3xl rotate-12" />
               ))}
            </div>
         </div>
         <div className="relative z-10 text-center px-4">
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic mb-4">Connect <span className="text-primary not-italic">Nodes</span></h1>
            <p className="text-slate-400 font-medium italic text-xl uppercase tracking-widest">Global Communication Interface</p>
         </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-24">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Information Side */}
            <div className="space-y-16">
               <div>
                  <h2 className="text-4xl font-black text-secondary tracking-tighter uppercase italic underline decoration-primary decoration-8 underline-offset-8 mb-8">Central Intelligence</h2>
                  <p className="text-slate-500 text-lg leading-relaxed italic max-w-lg">
                    Whether you are a patient seeking results or a clinical partner initiating a referral, our synchronized support network is ready to assist.
                  </p>
               </div>

               <div className="space-y-8">
                  <div className="p-4 bg-slate-50 rounded-[35px] border-2 border-slate-100 flex items-center gap-6">
                     <div className="p-4 bg-white rounded-2xl shadow-sm text-primary"><MapPin className="h-6 w-6" /></div>
                     <div className="flex-grow">
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2 italic">Select Target Node</p>
                        <div className="relative">
                           <select
                             className="w-full bg-transparent border-none outline-none font-black text-xl italic uppercase tracking-tighter appearance-none cursor-pointer text-secondary"
                             value={selectedBranchId}
                             onChange={(e) => setSelectedBranchId(e.target.value)}
                           >
                              <option value="all">Global Hub (All Branches)</option>
                              {branches.map(b => (
                                <option key={b.id} value={b.id}>{b.name.split("-")[1]?.trim().toUpperCase() || b.name.toUpperCase()}</option>
                              ))}
                           </select>
                           <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 pointer-events-none" />
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="p-8 rounded-[40px] bg-slate-900 text-white relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform"><Phone className="h-20 w-20" /></div>
                        <div className="space-y-8 relative z-10">
                           <div className="flex items-center gap-6">
                              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shadow-inner"><Phone className="h-6 w-6" /></div>
                              <div>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Direct Contact</p>
                                 <p className="text-xl font-black italic tracking-tighter">
                                   {selectedBranchId === "ho-branch" ? "0552 979 091" : (selectedBranch?.phone || "0555 777 333")}
                                 </p>
                              </div>
                           </div>
                           <div className="flex items-center gap-6">
                              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shadow-inner"><Mail className="h-6 w-6" /></div>
                              <div>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Official Uplink</p>
                                 <p className="text-xl font-black italic tracking-tighter">{selectedBranch?.email || "gracediagnosticgh@gmail.com"}</p>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="p-8 rounded-[40px] bg-primary text-white relative overflow-hidden group shadow-2xl shadow-primary/20">
                        <div className="absolute bottom-0 right-0 p-8 opacity-10 scale-150 -rotate-12 group-hover:rotate-0 transition-transform"><MapPin className="h-24 w-24" /></div>
                        <div className="relative z-10">
                           <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-8 shadow-inner"><Map className="h-6 w-6" /></div>
                           <h3 className="text-2xl font-black italic uppercase tracking-tighter">
                             {selectedBranchId === "all" ? "Main HQ" : "Node Site"}
                           </h3>
                           <p className="text-[10px] font-black uppercase tracking-widest text-white/70 mt-4 leading-relaxed">
                             {selectedBranch?.address || "Tantra Hills Roundabout,\n211 Mushroom Street,\nAccra, Ghana"}
                           </p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Branch Map Visual */}
               <div className="space-y-8">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic font-black">Regional Node Network</h3>
                  <div className="grid grid-cols-2 gap-4">
                     {branches.map(b => (
                       <div key={b.id} className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-100 flex items-center gap-4 hover:border-primary transition-all">
                          <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary"><MapPin className="h-5 w-5" /></div>
                          <span className="font-black text-[10px] uppercase tracking-widest text-secondary italic">{b.name.split("-")[1].trim()}</span>
                       </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Form Side */}
            <div className="bg-slate-50 rounded-[60px] p-12 lg:p-16 border border-slate-100 shadow-inner relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><ShieldCheck className="h-40 w-40 text-secondary" /></div>
               {isSent ? (
                 <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-green-50 text-green-500 rounded-[35px] flex items-center justify-center shadow-xl shadow-green-500/10 border-4 border-green-100 rotate-6">
                       <ShieldCheck className="h-12 w-12" />
                    </div>
                    <div>
                       <h3 className="text-4xl font-black text-secondary uppercase italic tracking-tighter">Signal Received</h3>
                       <p className="text-slate-400 font-medium italic mt-4">Communication successfully routed to the central hub.</p>
                    </div>
                    <button onClick={() => setIsSuccess(false)} className="text-primary font-black uppercase tracking-widest text-[10px] hover:underline italic">Initiate New Inquiry</button>
                 </div>
               ) : (
                 <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Identity</label>
                          <input required type="text" className="w-full px-8 py-5 rounded-2xl bg-white border-2 border-transparent focus:border-primary outline-none font-bold text-lg italic shadow-sm" placeholder="FULL NAME" value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Node Address</label>
                          <input required type="email" className="w-full px-8 py-5 rounded-2xl bg-white border-2 border-transparent focus:border-primary outline-none font-bold text-lg italic shadow-sm" placeholder="EMAIL@SYNC.COM" value={formState.email} onChange={e => setFormState({...formState, email: e.target.value})} />
                       </div>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Subject Classification</label>
                       <input required type="text" className="w-full px-8 py-5 rounded-2xl bg-white border-2 border-transparent focus:border-primary outline-none font-bold text-lg italic shadow-sm" placeholder="INQUIRY SECTOR..." value={formState.subject} onChange={e => setFormState({...formState, subject: e.target.value})} />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Intelligence Synthesis</label>
                       <textarea required rows={5} className="w-full px-8 py-5 rounded-[40px] bg-white border-2 border-transparent focus:border-primary outline-none font-bold text-lg italic shadow-sm resize-none" placeholder="YOUR MESSAGE..." value={formState.message} onChange={e => setFormState({...formState, message: e.target.value})} />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full bg-secondary text-white py-10 rounded-[45px] font-black uppercase tracking-[0.3em] text-xl flex items-center justify-center gap-6 hover:bg-primary transition-all shadow-2xl active:scale-95 italic">
                       {isSubmitting ? "ROUTING..." : (
                         <>
                           <ShieldCheck className="h-8 w-8 text-primary shadow-[0_0_15px_#C8A97E]" /> Send Communication
                           <ArrowRight className="h-5 w-5" />
                         </>
                       )}
                    </button>
                 </form>
               )}
            </div>
         </div>
      </section>
    </div>
  );
}
