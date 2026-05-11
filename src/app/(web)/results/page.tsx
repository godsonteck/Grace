"use client";

import { useState } from "react";
import {
  ShieldCheck, ArrowRight, Download, CheckCircle, AlertCircle, Search, FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ResultsPage() {
  const [resultId, setResultId] = useState("");
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRetrieve = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setReport(null);

    try {
      const res = await fetch(`/api/results/${resultId}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Result ID not found in current node cluster.");
        throw new Error("Could not establish connection to results server.");
      }
      const data = await res.json();
      setReport(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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
               <ShieldCheck className="h-5 w-5 text-primary" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">Clinical Intelligence Portal</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic mb-8">Retrieve <span className="text-primary not-italic">Results</span></h1>
            <p className="text-xl text-slate-400 font-medium italic">Secure access to your diagnostic intelligence via global Result ID.</p>
         </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 -mt-20 relative z-20 pb-32">
         <div className="bg-white rounded-[60px] shadow-[0_50px_150px_rgba(0,0,0,0.15)] border-[12px] border-slate-50 overflow-hidden">
            {!report ? (
              <div className="p-16 md:p-24 space-y-12">
                 <form onSubmit={handleRetrieve} className="space-y-8">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] ml-8 italic">Enter Result ID</label>
                    <div className="relative">
                       <FileText className="absolute left-8 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-300" />
                       <input
                         required
                         type="text"
                         className="w-full pl-20 pr-8 py-10 rounded-[40px] border-4 border-slate-50 focus:border-primary outline-none text-4xl font-black italic shadow-inner tracking-tighter bg-slate-50/30"
                         placeholder="GRC-XXXXXX"
                         value={resultId}
                         onChange={e => setResultId(e.target.value.toUpperCase())}
                       />
                    </div>
                    {error && (
                      <div className="flex items-center gap-4 p-6 bg-red-50 text-red-500 rounded-3xl border border-red-100 italic font-medium animate-in slide-in-from-top-4">
                         <AlertCircle className="h-6 w-6" /> {error}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-secondary text-white py-10 rounded-[45px] font-black uppercase tracking-[0.3em] text-xl flex items-center justify-center gap-6 hover:bg-primary transition-all shadow-2xl active:scale-95 italic"
                    >
                       {isLoading ? "ESTABLISHING LINK..." : (
                         <>
                           Access Secure Node <Search className="h-6 w-6" />
                         </>
                       )}
                    </button>
                 </form>
                 <div className="pt-12 border-t border-slate-50 text-center">
                    <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.4em] italic mb-4">Patient Security Protocol</p>
                    <p className="text-slate-400 text-sm italic font-medium leading-relaxed">
                       Your Result ID is provided at the time of diagnostic acquisition. <br/>If lost, please contact your originating node with valid identity verification.
                    </p>
                 </div>
              </div>
            ) : (
              <div className="animate-in fade-in zoom-in duration-500">
                 <div className="p-16 border-b bg-slate-50/50 flex justify-between items-center">
                    <div>
                       <h3 className="text-4xl font-black text-secondary tracking-tighter uppercase italic underline decoration-primary decoration-8 underline-offset-8">Clinical Analysis</h3>
                       <p className="text-[10px] text-primary font-black uppercase tracking-[0.5em] mt-8 italic">Validated Result Pipeline</p>
                    </div>
                    <button onClick={() => setReport(null)} className="text-slate-300 hover:text-secondary font-black uppercase text-[10px] tracking-widest italic underline underline-offset-4">New Retrieval</button>
                 </div>

                 <div className="p-16 space-y-12">
                    <div className="grid grid-cols-2 gap-12">
                       <div className="space-y-2">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Identity</p>
                          <p className="text-2xl font-black text-secondary uppercase tracking-tighter italic">{report.patient?.name}</p>
                       </div>
                       <div className="space-y-2 text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Procedure</p>
                          <p className="text-2xl font-black text-primary uppercase tracking-tighter italic">{report.appointment?.scanName}</p>
                       </div>
                    </div>

                    <div className="p-12 rounded-[50px] bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform"><CheckCircle className="h-32 w-32 text-primary" /></div>
                       <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-8 italic flex items-center gap-3">
                          <ShieldCheck className="h-4 w-4" /> Verified Clinical Impression
                       </p>
                       <p className="text-2xl font-medium italic leading-relaxed text-slate-300 relative z-10">
                          "{report.content}"
                       </p>
                       <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-end relative z-10">
                          <div>
                             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Issued At</p>
                             <p className="text-lg font-black italic tracking-tighter">{new Date(report.createdAt).toLocaleDateString()} • NODE: ACHIMOTA</p>
                          </div>
                          <button className="bg-primary text-secondary px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-white transition-all italic shadow-xl shadow-primary/20">
                             <Download className="h-4 w-4" /> Hardcopy PDF
                          </button>
                       </div>
                    </div>

                    {/* Laboratory Values if present */}
                    {report.labValues && (
                       <div className="space-y-8 animate-in slide-in-from-bottom-8">
                          <h4 className="text-2xl font-black text-secondary uppercase italic tracking-tighter flex items-center gap-4">
                             <div className="h-2 w-12 bg-primary rounded-full" /> Biochemical Synthesis
                          </h4>
                          <div className="overflow-hidden rounded-[40px] border-4 border-slate-50 shadow-inner">
                             <table className="w-full text-left">
                                <thead className="bg-slate-50">
                                   <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                      <th className="px-10 py-6">Parameter</th>
                                      <th className="px-10 py-6 text-center">Value</th>
                                      <th className="px-10 py-6 text-center">Reference</th>
                                   </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                   {JSON.parse(report.labValues).map((val: any, i: number) => (
                                      <tr key={i} className="italic">
                                         <td className="px-10 py-6 font-black text-secondary uppercase text-sm">{val.name}</td>
                                         <td className="px-10 py-6 text-center font-black text-primary text-lg tracking-tighter">{val.value} {val.unit}</td>
                                         <td className="px-10 py-6 text-center font-bold text-slate-400 text-xs">{val.reference}</td>
                                      </tr>
                                   ))}
                                </tbody>
                             </table>
                          </div>
                       </div>
                    )}
                 </div>
              </div>
            )}
         </div>
      </section>

      {/* Feature Highlight */}
      <section className="py-32 bg-slate-50 overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Node Synchronization", desc: "Results are replicated across our entire medical cluster for global accessibility.", icon: CheckCircle },
              { title: "Clinical Integrity", desc: "Every report is attested by a certified Radiologist before pipeline deployment.", icon: ShieldCheck },
              { title: "256-Bit Protection", desc: "All patient intelligence is encrypted using military-grade clinical protocols.", icon: AlertCircle }
            ].map((f, i) => (
              <div key={i} className="space-y-6 group">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl group-hover:bg-primary transition-all border-2 border-slate-100">
                    <f.icon className="h-8 w-8 text-primary group-hover:text-white" />
                 </div>
                 <h4 className="text-2xl font-black text-secondary uppercase italic tracking-tighter">{f.title}</h4>
                 <p className="text-slate-500 italic leading-relaxed">{f.desc}</p>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
}
