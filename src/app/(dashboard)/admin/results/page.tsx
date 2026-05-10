"use client";

import { useState, useMemo } from "react";
import { useData } from "@/context/DataContext";
import { branches } from "@/lib/data";
import {
  FileText, Search, Plus, Filter, ArrowRight,
  MapPin, Phone, Mail, User, ShieldCheck, X, Microscope, Download, ExternalLink, AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ResultsPage() {
  const { appointments, attachReport } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApt, setSelectedApt] = useState<any>(null);
  const [resultContent, setResultContent] = useState("");
  const [generatedId, setGeneratedId] = useState("");

  const pendingResults = useMemo(() =>
    appointments.filter(a => !a.reportAttached && (a.status === "confirmed" || a.status === "completed"))
      .filter(a => a.patientName.toLowerCase().includes(searchTerm.toLowerCase())),
    [appointments, searchTerm]
  );

  const archivedResults = useMemo(() =>
    appointments.filter(a => a.reportAttached)
      .filter(a => a.patientName.toLowerCase().includes(searchTerm.toLowerCase())),
    [appointments, searchTerm]
  );

  const handleGenerateResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApt || !resultContent) return;

    // Generate secure Result ID
    const resId = `GRC-${selectedApt.id.split('-')[1]}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    setGeneratedId(resId);
    attachReport(selectedApt.id);
  };

  const closePortal = () => {
    setSelectedApt(null);
    setResultContent("");
    setGeneratedId("");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex justify-between items-end mb-16">
          <div>
            <h1 className="text-5xl font-black text-secondary tracking-tighter uppercase italic underline decoration-primary decoration-8 underline-offset-8">Clinical Archive</h1>
            <p className="text-slate-400 text-lg mt-8 font-medium italic">Finalize diagnostic acquisitions and generate secure patient deliverables.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           {/* Queue */}
           <div className="space-y-8">
              <h2 className="text-2xl font-black text-secondary tracking-tighter uppercase italic flex items-center gap-3"><Clock className="h-6 w-6 text-primary" /> Acquisition Queue</h2>
              <div className="space-y-6">
                 {pendingResults.map(apt => (
                   <div key={apt.id} className="p-8 rounded-[40px] bg-white border-2 border-slate-50 hover:border-primary transition-all group shadow-sm hover:shadow-xl relative overflow-hidden">
                      {apt.priority === 'urgent' && <div className="absolute top-0 right-0 bg-red-500 text-white px-6 py-2 rounded-bl-3xl text-[9px] font-black uppercase tracking-widest italic animate-pulse">STAT PRIORITY</div>}
                      <div className="flex justify-between items-start">
                         <div>
                            <p className="font-black text-secondary text-lg italic uppercase">{apt.patientName}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">{apt.scanName} • {branches.find(b => b.id === apt.branchId)?.name.split("-")[1]}</p>
                         </div>
                         <button
                           onClick={() => setSelectedApt(apt)}
                           className="bg-primary/10 text-primary p-4 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm"
                         >
                           <Plus className="h-5 w-5" />
                         </button>
                      </div>
                   </div>
                 ))}
                 {pendingResults.length === 0 && <p className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 text-slate-400 font-black uppercase italic tracking-widest">Queue Clear</p>}
              </div>
           </div>

           {/* Archive */}
           <div className="space-y-8">
              <h2 className="text-2xl font-black text-secondary tracking-tighter uppercase italic flex items-center gap-3"><ShieldCheck className="h-6 w-6 text-primary" /> Validated Archive</h2>
              <div className="space-y-6">
                 {archivedResults.map(apt => (
                   <div key={apt.id} className="p-8 rounded-[40px] bg-slate-900 text-white border border-slate-800 transition-all group shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12"><ShieldCheck className="h-20 w-20 text-primary" /></div>
                      <div className="flex justify-between items-start relative z-10">
                         <div>
                            <p className="font-black text-primary text-lg italic uppercase tracking-tight">{apt.patientName}</p>
                            <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mt-2">{apt.scanName} • VERIFIED</p>
                         </div>
                         <div className="flex gap-3">
                            <button className="bg-white/5 p-4 rounded-2xl hover:bg-primary transition-all"><Download className="h-5 w-5" /></button>
                            <button className="bg-white/5 p-4 rounded-2xl hover:bg-white hover:text-secondary transition-all"><ExternalLink className="h-5 w-5" /></button>
                         </div>
                      </div>
                   </div>
                 ))}
                 {archivedResults.length === 0 && <p className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 text-slate-400 font-black uppercase italic tracking-widest">No Archived Records</p>}
              </div>
           </div>
        </div>
      </div>

      {/* Result Portal Modal */}
      {selectedApt && (
        <div className="fixed inset-0 bg-secondary/95 backdrop-blur-3xl z-[200] flex items-center justify-center p-6">
          <div className="bg-white rounded-[70px] shadow-2xl w-full max-w-3xl overflow-hidden border-[12px] border-white/50 relative">
             <div className="p-16 border-b bg-slate-50/50 flex justify-between items-center relative z-10">
                <div>
                   <h3 className="text-5xl font-black text-secondary tracking-tighter uppercase italic underline decoration-primary decoration-8 underline-offset-8">Synthesize Result</h3>
                   <p className="text-[10px] text-primary font-black uppercase tracking-[0.5em] mt-8 italic">Clinical Attestation Portal</p>
                </div>
                <button onClick={closePortal} className="p-6 bg-white rounded-3xl shadow-xl text-slate-300 hover:text-red-500 transition-all border border-slate-100"><X className="h-8 w-8" /></button>
             </div>

             {!generatedId ? (
               <form onSubmit={handleGenerateResult} className="p-16 space-y-12 relative z-10">
                  <div className="p-8 bg-blue-50 rounded-[40px] border-2 border-blue-100 flex gap-6 items-center italic">
                     <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20"><Microscope className="h-8 w-8" /></div>
                     <div>
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Case Mapping</p>
                        <p className="text-xl font-black text-blue-900 tracking-tighter uppercase">{selectedApt.patientName} • {selectedApt.scanName}</p>
                     </div>
                  </div>
                  <div className="space-y-6">
                     <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] ml-8 italic">Clinical Impression</label>
                     <textarea
                       required
                       rows={6}
                       className="w-full px-12 py-10 rounded-[50px] border-4 border-slate-50 focus:border-primary outline-none text-2xl font-black italic shadow-inner bg-slate-50/30 tracking-tighter resize-none"
                       placeholder="DOCUMENT FINDINGS..."
                       value={resultContent}
                       onChange={e => setResultContent(e.target.value)}
                     />
                  </div>
                  <button type="submit" className="w-full bg-secondary text-white py-12 rounded-[55px] font-black uppercase tracking-[0.3em] text-2xl flex items-center justify-center gap-8 hover:bg-primary transition-all shadow-2xl active:scale-95 italic">
                     <ShieldCheck className="h-12 w-12 text-primary shadow-[0_0_20px_#C8A97E]" /> Attest Result
                  </button>
               </form>
             ) : (
               <div className="p-20 text-center space-y-12 relative z-10 animate-in fade-in zoom-in duration-500">
                  <div className="w-32 h-32 bg-green-50 text-green-500 rounded-[50px] flex items-center justify-center mx-auto shadow-xl shadow-green-500/10 rotate-6 border-4 border-green-100">
                     <CheckCircle className="h-16 w-16" />
                  </div>
                  <div>
                     <h4 className="text-4xl font-black text-secondary tracking-tighter uppercase italic mb-4">Result Attested</h4>
                     <p className="text-slate-400 italic font-medium">The diagnostic report has been securely hashed and encrypted.</p>
                  </div>
                  <div className="p-10 bg-slate-900 rounded-[50px] border-4 border-slate-800 shadow-2xl">
                     <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.5em] mb-4 italic">Secure Result ID</p>
                     <p className="text-5xl font-black text-primary tracking-tighter italic select-all">{generatedId}</p>
                  </div>
                  <div className="flex gap-6">
                     <button className="flex-1 bg-slate-100 py-6 rounded-3xl font-black uppercase tracking-widest text-xs italic hover:bg-slate-200 transition-all">Download PDF</button>
                     <button onClick={closePortal} className="flex-1 bg-secondary text-white py-6 rounded-3xl font-black uppercase tracking-widest text-xs italic hover:bg-primary transition-all">Close Pipeline</button>
                  </div>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
}

function Clock({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24" height="24"
      viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24" height="24"
      viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}
