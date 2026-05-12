"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useData } from "@/context/DataContext";
import { branches, scanTypes } from "@/lib/data";
import { CheckCircle2, ShieldCheck, Stethoscope, User, FileText, ArrowRight, AlertCircle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

function BookContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { records, addAppointment } = useData();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    patientDob: "",
    scanId: searchParams.get("scanId") || "",
    branchId: searchParams.get("branchId") || "",
    date: "",
    time: "",
    notes: "",
    priority: "normal",
    referringDoctor: "",
  });

  const selectedScan = useMemo(() =>
    records.find(p => p.id === formData.scanId),
    [formData.scanId, records]
  );

  const selectedBranch = useMemo(() =>
    branches.find(b => b.id === formData.branchId),
    [formData.branchId]
  );

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. First Ensure Patient exists/is created
      const patientRes = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.patientName,
          email: formData.patientEmail,
          phone: formData.patientPhone,
          dob: formData.patientDob,
          gender: "Not Specified", // Default for now
        }),
      });

      const patient = await patientRes.json();

      if (!patient.id) throw new Error("Failed to register patient");

      // 2. Create Appointment
      const appointmentRes = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: patient.id,
          branchId: formData.branchId,
          scanId: formData.scanId,
          scanName: selectedScan?.name || "Unknown Scan",
          date: formData.date,
          time: formData.time,
          priority: formData.priority,
          referringDoctor: formData.referringDoctor,
          notes: formData.notes,
        }),
      });

      if (!appointmentRes.ok) throw new Error("Failed to book appointment");

      const newAppointment = await appointmentRes.json();

      // Update local context for UI sync
      addAppointment({
        ...newAppointment,
        patientName: formData.patientName, // Local display optimization
      });

      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (error) {
      console.error("Booking Error:", error);
      setIsSubmitting(false);
      alert("Encountered a pipeline error. Please try again or contact support.");
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center font-sans">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-[35px] flex items-center justify-center mx-auto mb-10 shadow-xl shadow-green-500/10 rotate-3">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <h1 className="text-4xl font-black text-secondary mb-6 tracking-tighter uppercase italic underline decoration-primary decoration-8 underline-offset-8">Request Orchestrated</h1>
        <p className="text-slate-400 text-lg mb-12 italic font-medium leading-relaxed">
          Thank you, {formData.patientName}. Your appointment request for {selectedScan?.name} at our {selectedBranch?.name.includes("-") ? selectedBranch.name.split("-")[1].trim() : selectedBranch?.name} node has been prioritized in the clinical pipeline.
        </p>
        <button
          onClick={() => router.push("/web")}
          className="bg-secondary text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-primary transition-all shadow-2xl active:scale-95"
        >
          Return to Hub
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 font-sans">
      <div className="mb-16 text-center">
        <div className="inline-flex items-center gap-3 px-5 py-2 bg-slate-100 rounded-full border border-slate-200 mb-6">
           <ShieldCheck className="h-4 w-4 text-primary" />
           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 italic">Secure Clinical Portal</span>
        </div>
        <h1 className="text-5xl font-black text-secondary mb-6 tracking-tighter uppercase italic">Book Procedure</h1>
        <p className="text-slate-400 italic font-medium">Synchronize your diagnostic schedule with our regional network.</p>

        {/* Progress Bar */}
        <div className="flex items-center justify-center mt-12 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all rotate-3",
                step === i ? "bg-primary text-white shadow-xl shadow-primary/30 scale-110" :
                step > i ? "bg-secondary text-white" : "bg-white border-2 border-slate-100 text-slate-300"
              )}>
                {step > i ? <CheckCircle2 className="h-6 w-6" /> : i}
              </div>
              {i < 3 && <div className={cn("w-16 h-1 mx-3 rounded-full", step > i ? "bg-secondary" : "bg-slate-100")} />}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[50px] border-4 border-slate-50 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 pointer-events-none"><ShieldCheck className="h-40 w-40 text-primary" /></div>

        <form onSubmit={handleSubmit} className="relative z-10">
          {step === 1 && (
            <div className="p-10 md:p-16 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-black text-secondary mb-12 flex items-center gap-4 tracking-tighter uppercase italic">
                <div className="p-3 bg-primary/10 rounded-xl"><User className="text-primary h-6 w-6" /></div> Patient Identity
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label htmlFor="patientName" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 italic">Full Legal Name</label>
                  <input
                    id="patientName"
                    required
                    type="text"
                    className="w-full px-8 py-5 rounded-2xl border-2 border-slate-50 bg-slate-50/50 focus:border-primary focus:bg-white outline-none transition-all font-bold text-lg italic shadow-inner"
                    placeholder="KWAME ANTWI..."
                    value={formData.patientName}
                    onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                  />
                </div>
                <div className="space-y-4">
                  <label htmlFor="patientDob" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 italic">Date of Birth</label>
                  <input
                    id="patientDob"
                    required
                    type="date"
                    className="w-full px-8 py-5 rounded-2xl border-2 border-slate-50 bg-slate-50/50 focus:border-primary focus:bg-white outline-none transition-all font-bold text-lg italic shadow-inner"
                    value={formData.patientDob}
                    onChange={(e) => setFormData({...formData, patientDob: e.target.value})}
                  />
                </div>
                <div className="space-y-4">
                  <label htmlFor="patientEmail" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 italic">Email Channel</label>
                  <input
                    id="patientEmail"
                    required
                    type="email"
                    className="w-full px-8 py-5 rounded-2xl border-2 border-slate-50 bg-slate-50/50 focus:border-primary focus:bg-white outline-none transition-all font-bold text-lg italic shadow-inner"
                    placeholder="CHANNEL@SECURE.COM"
                    value={formData.patientEmail}
                    onChange={(e) => setFormData({...formData, patientEmail: e.target.value})}
                  />
                </div>
                <div className="space-y-4">
                  <label htmlFor="patientPhone" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 italic">Mobile Uplink</label>
                  <input
                    id="patientPhone"
                    required
                    type="tel"
                    className="w-full px-8 py-5 rounded-2xl border-2 border-slate-50 bg-slate-50/50 focus:border-primary focus:bg-white outline-none transition-all font-bold text-lg italic shadow-inner"
                    placeholder="+233 24 000 0000"
                    value={formData.patientPhone}
                    onChange={(e) => setFormData({...formData, patientPhone: e.target.value})}
                  />
                </div>
              </div>
              <div className="mt-16 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-primary text-white px-12 py-5 rounded-3xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-secondary transition-all shadow-xl shadow-primary/20"
                >
                  Configure Procedure <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-10 md:p-16 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-black text-secondary mb-12 flex items-center gap-4 tracking-tighter uppercase italic">
                <div className="p-3 bg-primary/10 rounded-xl"><FileText className="text-primary h-6 w-6" /></div> Scan Logic
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 italic">Clinical Procedure</label>
                  <select
                    required
                    className="w-full px-8 py-5 rounded-2xl border-2 border-slate-50 bg-slate-50/50 focus:border-primary focus:bg-white outline-none transition-all font-bold text-lg italic shadow-inner appearance-none"
                    value={formData.scanId}
                    onChange={(e) => setFormData({...formData, scanId: e.target.value})}
                  >
                    <option value="">SELECT PROTOCOL...</option>
                    {scanTypes.map(type => (
                      <optgroup key={type.id} label={type.name.toUpperCase()}>
                        {records.filter(p => p.scanTypeId === type.id).map(part => (
                          <option key={part.id} value={part.id}>{part.name.toUpperCase()}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 italic">Target Node</label>
                  <select
                    required
                    className="w-full px-8 py-5 rounded-2xl border-2 border-slate-50 bg-slate-50/50 focus:border-primary focus:bg-white outline-none transition-all font-bold text-lg italic shadow-inner appearance-none"
                    value={formData.branchId}
                    onChange={(e) => setFormData({...formData, branchId: e.target.value})}
                  >
                    <option value="">SELECT BRANCH...</option>
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.id}>{branch.name.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 italic">Referring Physician</label>
                  <div className="relative">
                    <Stethoscope className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <input
                      type="text"
                      className="w-full pl-16 pr-8 py-5 rounded-2xl border-2 border-slate-50 bg-slate-50/50 focus:border-primary focus:bg-white outline-none transition-all font-bold text-lg italic shadow-inner"
                      placeholder="DR. NAME..."
                      value={formData.referringDoctor}
                      onChange={(e) => setFormData({...formData, referringDoctor: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 italic">Priority Level</label>
                   <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, priority: 'normal'})}
                        className={cn("py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all italic border-2", formData.priority === 'normal' ? "bg-slate-100 border-slate-200 text-secondary shadow-inner" : "bg-white border-slate-50 text-slate-300")}
                      >Normal</button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, priority: 'urgent'})}
                        className={cn("py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all italic border-2 flex items-center justify-center gap-2", formData.priority === 'urgent' ? "bg-red-50 border-red-100 text-red-600 shadow-xl shadow-red-500/10" : "bg-white border-slate-50 text-slate-300")}
                      ><AlertCircle className="h-4 w-4" /> Stat/Urgent</button>
                   </div>
                </div>
              </div>

              {selectedScan && (
                <div className="mt-12 p-8 bg-primary/5 rounded-[35px] border-2 border-primary/10 flex gap-8 items-center">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-primary shadow-xl shadow-primary/5 shrink-0 rotate-3 font-black text-4xl italic">$</div>
                  <div>
                    <h4 className="text-2xl font-black text-secondary tracking-tighter italic uppercase underline decoration-primary decoration-4 underline-offset-4 mb-2">Aggregate Cost: ${selectedScan.price}</h4>
                    <p className="text-sm text-slate-400 font-medium italic">Includes diagnostic acquisition and secure report delivery. <br/>Prep: {selectedScan.preparation}</p>
                  </div>
                </div>
              )}

              <div className="mt-16 flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] text-slate-400 hover:text-secondary transition-all italic"
                >
                  Reverse
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-primary text-white px-12 py-5 rounded-3xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-secondary transition-all shadow-xl shadow-primary/20"
                >
                  Synchronize Clock <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-10 md:p-16 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-black text-secondary mb-12 flex items-center gap-4 tracking-tighter uppercase italic">
                <div className="p-3 bg-primary/10 rounded-xl"><Calendar className="text-primary h-6 w-6" /></div> Schedule Node
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label htmlFor="targetDate" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 italic">Target Date</label>
                  <input
                    id="targetDate"
                    required
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-8 py-5 rounded-2xl border-2 border-slate-50 bg-slate-50/50 focus:border-primary focus:bg-white outline-none transition-all font-bold text-lg italic shadow-inner"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="space-y-4">
                  <label htmlFor="targetTime" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 italic">Operational Slot</label>
                  <select
                    id="targetTime"
                    required
                    className="w-full px-8 py-5 rounded-2xl border-2 border-slate-50 bg-slate-50/50 focus:border-primary focus:bg-white outline-none transition-all font-bold text-lg italic shadow-inner appearance-none"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  >
                    <option value="">SELECT SLOT...</option>
                    <option value="morning">MORNING (08:00 - 12:00)</option>
                    <option value="afternoon">AFTERNOON (12:00 - 16:00)</option>
                    <option value="evening">EVENING (16:00 - 20:00)</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 italic">Additional Clinical Notes</label>
                   <textarea
                     rows={3}
                     className="w-full px-8 py-5 rounded-3xl border-2 border-slate-50 bg-slate-50/50 focus:border-primary focus:bg-white outline-none transition-all font-bold text-lg italic shadow-inner resize-none"
                     placeholder="ANY SPECIAL REQUIREMENTS OR CLINICAL HISTORY..."
                     value={formData.notes}
                     onChange={(e) => setFormData({...formData, notes: e.target.value})}
                   />
                </div>
              </div>
              <div className="mt-16 flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] text-slate-400 hover:text-secondary transition-all italic"
                >
                  Reverse
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "bg-secondary text-white px-16 py-6 rounded-[35px] font-black uppercase tracking-[0.2em] text-sm transition-all shadow-2xl flex items-center gap-4 italic active:scale-95",
                    isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-primary shadow-secondary/20 hover:shadow-primary/20"
                  )}
                >
                  {isSubmitting ? "SYCHRONIZING..." : "ATTEST REQUEST"}
                  {!isSubmitting && <ShieldCheck className="h-6 w-6 text-primary shadow-[0_0_15px_#C8A97E]" />}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      <div className="mt-12 flex items-center justify-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-widest italic">
         <ShieldCheck className="h-4 w-4" /> Data encrypted via clinical-grade SSL-X protocols.
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-10 w-64 bg-slate-200 rounded mx-auto mb-4" />
        <div className="h-32 w-full bg-white border rounded-3xl" />
      </div>
    }>
      <BookContent />
    </Suspense>
  );
}
