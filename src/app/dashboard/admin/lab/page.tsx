"use client";

import { useState, useMemo } from "react";
import { useData } from "@/context/DataContext";
import { branches } from "@/lib/data";
import {
  Beaker, Plus, ShieldCheck, X, Download, CheckCircle
} from "lucide-react";

export default function LabResultsPage() {
  const { appointments, attachReport } = useData();
  const [searchTerm] = useState("");
  const [selectedApt, setSelectedApt] = useState<any>(null);
  const [labFields, setLabFields] = useState([{ name: "", value: "", unit: "", reference: "" }]);
  const [generatedId, setGeneratedId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pendingLabs = useMemo(() =>
    appointments.filter(a => !a.reportAttached && a.scanName.toLowerCase().includes("lab"))
      .filter(a => a.patientName.toLowerCase().includes(searchTerm.toLowerCase())),
    [appointments, searchTerm]
  );

  const archivedLabs = useMemo(() =>
    appointments.filter(a => a.reportAttached && a.scanName.toLowerCase().includes("lab"))
      .filter(a => a.patientName.toLowerCase().includes(searchTerm.toLowerCase())),
    [appointments, searchTerm]
  );

  const handleAddField = () => {
    setLabFields([...labFields, { name: "", value: "", unit: "", reference: "" }]);
  };

  const handleRemoveField = (index: number) => {
    setLabFields(labFields.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index: number, key: string, value: string) => {
    const newFields = [...labFields];
    (newFields[index] as any)[key] = value;
    setLabFields(newFields);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApt) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: selectedApt.id,
          patientId: selectedApt.patientId,
          content: "Laboratory analysis completed.",
          type: "LABORATORY",
          labValues: JSON.stringify(labFields),
          statFlag: selectedApt.priority === 'urgent',
        }),
      });

      if (!res.ok) throw new Error("Failed to attest lab report");

      const report = await res.json();
      setGeneratedId(report.resultId);
      attachReport(selectedApt.id);
    } catch (_error) {
      alert("Pipeline failure: Could not attest laboratory result.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closePortal = () => {
    setSelectedApt(null);
    setLabFields([{ name: "", value: "", unit: "", reference: "" }]);
    setGeneratedId("");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex justify-between items-end mb-16">
          <div>
            <h1 className="text-5xl font-black text-secondary tracking-tighter uppercase italic underline decoration-primary decoration-8 underline-offset-8">Laboratory Hub</h1>
            <p className="text-slate-400 text-lg mt-8 font-medium italic">Process clinical specimens and synthesize laboratory intelligence.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           {/* Queue */}
           <div className="space-y-8">
              <h2 className="text-2xl font-black text-secondary tracking-tighter uppercase italic flex items-center gap-3"><Beaker className="h-6 w-6 text-primary" /> Specimen Queue</h2>
              <div className="space-y-6">
                 {pendingLabs.map(apt => (
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
                 {pendingLabs.length === 0 && <p className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 text-slate-400 font-black uppercase italic tracking-widest">Queue Clear</p>}
              </div>
           </div>

           {/* Archive */}
           <div className="space-y-8">
              <h2 className="text-2xl font-black text-secondary tracking-tighter uppercase italic flex items-center gap-3"><ShieldCheck className="h-6 w-6 text-primary" /> Validated Lab Reports</h2>
              <div className="space-y-6">
                 {archivedLabs.map(apt => (
                   <div key={apt.id} className="p-8 rounded-[40px] bg-slate-900 text-white border border-slate-800 transition-all group shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12"><Beaker className="h-20 w-20 text-primary" /></div>
                      <div className="flex justify-between items-start relative z-10">
                         <div>
                            <p className="font-black text-primary text-lg italic uppercase tracking-tight">{apt.patientName}</p>
                            <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mt-2">{apt.scanName} • LAB VERIFIED</p>
                         </div>
                         <div className="flex gap-3">
                            <button className="bg-white/5 p-4 rounded-2xl hover:bg-primary transition-all"><Download className="h-5 w-5" /></button>
                         </div>
                      </div>
                   </div>
                 ))}
                 {archivedLabs.length === 0 && <p className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 text-slate-400 font-black uppercase italic tracking-widest">No Archived Lab Reports</p>}
              </div>
           </div>
        </div>
      </div>

      {/* Lab Portal Modal */}
      {selectedApt && (
        <div className="fixed inset-0 bg-secondary/95 backdrop-blur-3xl z-[200] flex items-center justify-center p-6">
          <div className="bg-white rounded-[70px] shadow-2xl w-full max-w-4xl overflow-hidden border-[12px] border-white/50 relative max-h-[90vh] flex flex-col">
             <div className="p-16 border-b bg-slate-50/50 flex justify-between items-center shrink-0">
                <div>
                   <h3 className="text-5xl font-black text-secondary tracking-tighter uppercase italic underline decoration-primary decoration-8 underline-offset-8">Synthesize Lab Result</h3>
                   <p className="text-[10px] text-primary font-black uppercase tracking-[0.5em] mt-8 italic">Biochemical Attestation Portal</p>
                </div>
                <button onClick={closePortal} className="p-6 bg-white rounded-3xl shadow-xl text-slate-300 hover:text-red-500 transition-all border border-slate-100"><X className="h-8 w-8" /></button>
             </div>

             {!generatedId ? (
               <form onSubmit={handleSubmit} className="p-16 space-y-12 overflow-y-auto flex-grow custom-scrollbar">
                  <div className="p-8 bg-blue-50 rounded-[40px] border-2 border-blue-100 flex gap-6 items-center italic">
                     <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20"><Beaker className="h-8 w-8" /></div>
                     <div>
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Specimen Mapping</p>
                        <p className="text-xl font-black text-blue-900 tracking-tighter uppercase">{selectedApt.patientName} • {selectedApt.scanName}</p>
                     </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] ml-8 italic">Parameters</label>
                       <button
                         type="button"
                         onClick={handleAddField}
                         className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest italic hover:underline"
                       >
                         <Plus className="h-4 w-4" /> Add Parameter
                       </button>
                    </div>

                    <div className="space-y-4">
                       {labFields.map((field, idx) => (
                         <div key={idx} className="grid grid-cols-4 gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100 relative group animate-in slide-in-from-right-4">
                            <input
                              placeholder="PARAM (e.g. Glucose)"
                              className="bg-white px-5 py-3 rounded-xl border-2 border-transparent focus:border-primary outline-none font-black text-xs italic"
                              value={field.name}
                              onChange={e => handleFieldChange(idx, 'name', e.target.value)}
                            />
                            <input
                              placeholder="VALUE"
                              className="bg-white px-5 py-3 rounded-xl border-2 border-transparent focus:border-primary outline-none font-black text-xs italic"
                              value={field.value}
                              onChange={e => handleFieldChange(idx, 'value', e.target.value)}
                            />
                            <input
                              placeholder="UNIT"
                              className="bg-white px-5 py-3 rounded-xl border-2 border-transparent focus:border-primary outline-none font-black text-xs italic"
                              value={field.unit}
                              onChange={e => handleFieldChange(idx, 'unit', e.target.value)}
                            />
                            <div className="flex gap-2">
                               <input
                                 placeholder="REF RANGE"
                                 className="flex-grow bg-white px-5 py-3 rounded-xl border-2 border-transparent focus:border-primary outline-none font-black text-xs italic"
                                 value={field.reference}
                                 onChange={e => handleFieldChange(idx, 'reference', e.target.value)}
                               />
                               <button
                                 type="button"
                                 onClick={() => handleRemoveField(idx)}
                                 className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                               >
                                 <X className="h-4 w-4" />
                               </button>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-secondary text-white py-12 rounded-[55px] font-black uppercase tracking-[0.3em] text-2xl flex items-center justify-center gap-8 hover:bg-primary transition-all shadow-2xl active:scale-95 italic"
                  >
                     {isSubmitting ? "SYNCING..." : (
                       <>
                         <ShieldCheck className="h-12 w-12 text-primary shadow-[0_0_20px_#C8A97E]" /> Attest Lab Result
                       </>
                     )}
                  </button>
               </form>
             ) : (
               <div className="p-20 text-center space-y-12 relative z-10 animate-in fade-in zoom-in duration-500">
                  <div className="w-32 h-32 bg-green-50 text-green-500 rounded-[50px] flex items-center justify-center mx-auto shadow-xl shadow-green-500/10 rotate-6 border-4 border-green-100">
                     <CheckCircle className="h-16 w-16" />
                  </div>
                  <div>
                     <h4 className="text-4xl font-black text-secondary tracking-tighter uppercase italic mb-4">Laboratory Report Attested</h4>
                     <p className="text-slate-400 italic font-medium">The biochemical analysis has been securely finalized and indexed.</p>
                  </div>
                  <div className="p-10 bg-slate-900 rounded-[50px] border-4 border-slate-800 shadow-2xl">
                     <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.5em] mb-4 italic">Secure Result ID</p>
                     <p className="text-5xl font-black text-primary tracking-tighter italic select-all">{generatedId}</p>
                  </div>
                  <button onClick={closePortal} className="w-full bg-secondary text-white py-8 rounded-[35px] font-black uppercase tracking-widest text-xs italic hover:bg-primary transition-all">Close Portal</button>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
