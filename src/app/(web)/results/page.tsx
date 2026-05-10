"use client";

import { useState } from "react";
import { Search, FileText, Download, ShieldCheck, AlertCircle, Calendar, MapPin, Microscope, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function PatientResultsPage() {
  const [resultId, setResultId] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState("");

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resultId) return;

    setLoading(true);
    setError("");
    setReport(null);

    try {
      const res = await fetch(`/api/results/${resultId.trim().toUpperCase()}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Result ID not found. Please verify and try again.");
        throw new Error("Pipeline error. Could not retrieve report.");
      }
      const data = await res.json();
      setReport(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#F8FAFC] py-20 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-slate-100 rounded-full border border-slate-200 mb-8">
             <ShieldCheck className="h-4 w-4 text-primary" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 italic">Secure Patient Access</span>
          </div>
          <h1 className="text-6xl font-black text-secondary tracking-tighter uppercase italic mb-6">Retrieve Results</h1>
          <p className="text-slate-400 font-medium italic max-w-xl mx-auto">Access your diagnostic reports using the secure Result ID provided at the time of your procedure.</p>
        </header>

        {!report ? (
          <div className="bg-white rounded-[50px] p-12 md:p-20 shadow-2xl border-4 border-slate-50 animate-in fade-in zoom-in duration-500">
             <form onSubmit={handleLookup} className="space-y-12">
                <div className="space-y-6">
                   <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] ml-8 italic">Enter Result ID</label>
                   <div className="relative">
                      <FileText className="absolute left-8 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-300" />
                      <input
                        required
                        type="text"
                        placeholder="GRC-XXXX-XXXX"
                        className="w-full pl-20 pr-8 py-10 rounded-[40px] border-4 border-slate-50 focus:border-primary outline-none text-4xl font-black italic shadow-inner bg-slate-50/50 tracking-[0.1em] placeholder:tracking-normal placeholder:opacity-20 transition-all"
                        value={resultId}
                        onChange={(e) => setResultId(e.target.value)}
                      />
                   </div>
                </div>

                {error && (
                  <div className="p-8 bg-red-50 rounded-3xl border-2 border-red-100 flex items-center gap-6 text-red-600 animate-in slide-in-from-top-2">
                     <AlertCircle className="h-8 w-8 shrink-0" />
                     <p className="font-black italic text-lg">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "w-full bg-secondary text-white py-12 rounded-[50px] font-black uppercase tracking-[0.3em] text-2xl flex items-center justify-center gap-8 hover:bg-primary transition-all shadow-2xl active:scale-95 italic",
                    loading && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {loading ? "SEARCHING ARCHIVE..." : (
                    <>
                       Access Pipeline <ShieldCheck className="h-10 w-10 text-primary shadow-[0_0_20px_#C8A97E]" />
                    </>
                  )}
                </button>
             </form>

             <div className="mt-16 pt-10 border-t border-slate-50 flex items-center justify-center gap-4 text-slate-300 text-[10px] font-black uppercase tracking-widest italic">
                <ShieldCheck className="h-4 w-4" /> HIPAA-Compliant AES-256 Encryption Active
             </div>
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
             <button
               onClick={() => setReport(null)}
               className="flex items-center gap-3 text-slate-400 hover:text-secondary font-black uppercase text-[10px] tracking-widest italic transition-all"
             >
                <ArrowLeft className="h-4 w-4" /> Back to Search
             </button>

             <div className="bg-white rounded-[60px] shadow-2xl border-4 border-slate-50 overflow-hidden">
                <div className="p-12 md:p-16 border-b bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                   <div>
                      <h2 className="text-4xl font-black text-secondary tracking-tighter uppercase italic">{report.patient.name}</h2>
                      <div className="flex flex-wrap items-center gap-6 mt-4">
                         <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                            <Calendar className="h-4 w-4 text-primary" /> {new Date(report.appointment.date).toLocaleDateString()}
                         </div>
                         <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                            <MapPin className="h-4 w-4 text-primary" /> {report.appointment.branch.name.split("-")[1] || report.appointment.branch.name}
                         </div>
                      </div>
                   </div>
                   <div className="px-8 py-4 bg-secondary text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] italic">
                      ID: {report.resultId}
                   </div>
                </div>

                <div className="p-12 md:p-16 space-y-16">
                   <div className="p-10 rounded-[40px] bg-primary/5 border-2 border-primary/10 flex gap-8 items-center italic relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12"><Microscope className="h-32 w-32" /></div>
                      <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0"><Microscope className="h-8 w-8" /></div>
                      <div>
                         <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Diagnostic Protocol</p>
                         <p className="text-2xl font-black text-secondary tracking-tighter uppercase">{report.appointment.scanName}</p>
                      </div>
                   </div>

                   <div className="space-y-8">
                      <h3 className="text-xl font-black text-secondary uppercase tracking-tight italic underline decoration-primary decoration-4 underline-offset-4">Clinical Impression</h3>
                      <div className="text-2xl font-black text-slate-600 italic leading-relaxed tracking-tight border-l-8 border-slate-100 pl-10 py-4">
                         {report.content}
                      </div>
                   </div>

                   {report.type === "LABORATORY" && report.labValues && (
                     <div className="space-y-8">
                        <h3 className="text-xl font-black text-secondary uppercase tracking-tight italic underline decoration-primary decoration-4 underline-offset-4">Biochemical Parameters</h3>
                        <div className="overflow-hidden rounded-[30px] border-2 border-slate-50">
                           <table className="w-full text-left">
                              <thead>
                                 <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <th className="px-8 py-5">Parameter</th>
                                    <th className="px-8 py-5">Value</th>
                                    <th className="px-8 py-5">Reference Range</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                 {JSON.parse(report.labValues).map((field: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                       <td className="px-8 py-5 font-black text-secondary text-sm italic">{field.name}</td>
                                       <td className="px-8 py-5 font-black text-primary text-sm italic">{field.value} <span className="text-[10px] text-slate-400 ml-1">{field.unit}</span></td>
                                       <td className="px-8 py-5 font-black text-slate-400 text-[10px] italic">{field.reference}</td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                   )}

                   <div className="pt-10 border-t border-slate-50 flex gap-6">
                      <button className="flex-1 bg-secondary text-white py-8 rounded-[35px] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 hover:bg-primary transition-all shadow-xl active:scale-95 italic">
                         <Download className="h-5 w-5" /> Download PDF Report
                      </button>
                   </div>
                </div>
             </div>

             <div className="p-10 bg-blue-50 rounded-[40px] border-2 border-blue-100 flex gap-8 items-center text-blue-900 italic">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0"><ShieldCheck className="h-8 w-8" /></div>
                <div>
                   <p className="font-black text-lg tracking-tight uppercase mb-1">Verified Clinical Document</p>
                   <p className="text-sm font-medium opacity-70">This report has been digitally attested by Grace Diagnostic Centre and is legally valid for clinical consultation.</p>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
