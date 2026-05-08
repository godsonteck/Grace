"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { scanTypes, bodyParts as initialBodyParts, branches, BodyPart } from "@/lib/data";
import { Calendar, Clock, User, Mail, Phone, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

function BookContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [records, setRecords] = useState<BodyPart[]>(initialBodyParts);

  // Load records from localStorage
  useEffect(() => {
    const savedRecords = localStorage.getItem("grace_records");
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    patientDob: "",
    scanId: searchParams.get("scanId") || "",
    branchId: "",
    date: "",
    time: "",
    notes: "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const appointments = JSON.parse(localStorage.getItem("grace_appointments") || "[]");
      const newAppointment = {
        id: `apt-${Date.now()}`,
        ...formData,
        scanName: selectedScan?.name || "Unknown Scan",
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("grace_appointments", JSON.stringify([newAppointment, ...appointments]));

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <h1 className="text-3xl font-bold text-secondary mb-4">Request Submitted!</h1>
        <p className="text-muted text-lg mb-8">
          Thank you, {formData.patientName}. Your appointment request for a {selectedScan?.name} at our {selectedBranch?.name} has been received. Our team will contact you shortly to confirm the time.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-secondary mb-4">Book an Appointment</h1>
        <p className="text-muted">Fill out the form below to request a diagnostic scan at one of our centers.</p>

        {/* Progress Bar */}
        <div className="flex items-center justify-center mt-8 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all",
                step === i ? "bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/20" :
                step > i ? "bg-green-500 border-green-500 text-white" : "bg-white border-slate-200 text-slate-400"
              )}>
                {step > i ? <CheckCircle2 className="h-6 w-6" /> : i}
              </div>
              {i < 3 && <div className={cn("w-12 h-0.5 mx-2", step > i ? "bg-green-500" : "bg-slate-200")} />}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border shadow-xl shadow-slate-200/50 overflow-hidden">
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="p-8 md:p-12 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-bold text-secondary mb-8 flex items-center gap-3">
                <User className="text-primary" /> Patient Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-secondary">Full Name</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="Enter your full name"
                    value={formData.patientName}
                    onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-secondary">Date of Birth</label>
                  <input
                    required
                    type="date"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={formData.patientDob}
                    onChange={(e) => setFormData({...formData, patientDob: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-secondary">Email Address</label>
                  <input
                    required
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="name@example.com"
                    value={formData.patientEmail}
                    onChange={(e) => setFormData({...formData, patientEmail: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-secondary">Phone Number</label>
                  <input
                    required
                    type="tel"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="+1 (555) 000-0000"
                    value={formData.patientPhone}
                    onChange={(e) => setFormData({...formData, patientPhone: e.target.value})}
                  />
                </div>
              </div>
              <div className="mt-12 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-primary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  Continue to Scan Details <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-8 md:p-12 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-bold text-secondary mb-8 flex items-center gap-3">
                <FileText className="text-primary" /> Scan Selection
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-secondary">Select Diagnostic Scan</label>
                  <select
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                    value={formData.scanId}
                    onChange={(e) => setFormData({...formData, scanId: e.target.value})}
                  >
                    <option value="">Choose a scan...</option>
                    {scanTypes.map(type => (
                      <optgroup key={type.id} label={type.name}>
                        {records.filter(p => p.scanTypeId === type.id).map(part => (
                          <option key={part.id} value={part.id}>{part.name}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-secondary">Preferred Center</label>
                  <select
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                    value={formData.branchId}
                    onChange={(e) => setFormData({...formData, branchId: e.target.value})}
                  >
                    <option value="">Choose a branch...</option>
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.id}>{branch.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              {selectedScan && (
                <div className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border text-primary shrink-0">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary">Estimated Cost: ${selectedScan.price}</h4>
                    <p className="text-sm text-muted">Price includes standard procedure and report. Preparation: {selectedScan.preparation}</p>
                  </div>
                </div>
              )}
              <div className="mt-12 flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-8 py-3 rounded-xl font-bold text-secondary hover:bg-slate-50 transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-primary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  Choose Date & Time <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-8 md:p-12 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-bold text-secondary mb-8 flex items-center gap-3">
                <Calendar className="text-primary" /> Schedule
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-secondary">Preferred Date</label>
                  <input
                    required
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-secondary">Preferred Time Range</label>
                  <select
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  >
                    <option value="">Choose a time slot...</option>
                    <option value="morning">Morning (8:00 AM - 12:00 PM)</option>
                    <option value="afternoon">Afternoon (12:00 PM - 4:00 PM)</option>
                    <option value="evening">Evening (4:00 PM - 8:00 PM)</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-secondary">Additional Notes or Symptoms (Optional)</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    placeholder="Mention any allergies, previous conditions, or specific concerns..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                </div>
              </div>
              <div className="mt-12 flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-8 py-3 rounded-xl font-bold text-secondary hover:bg-slate-50 transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "bg-secondary text-white px-12 py-3 rounded-xl font-bold transition-all shadow-lg shadow-secondary/20 flex items-center gap-2",
                    isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-slate-800"
                  )}
                >
                  {isSubmitting ? "Processing..." : "Confirm Request"}
                  {!isSubmitting && <CheckCircle2 className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function DollarSign({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24" height="24"
      viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={className}
    >
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
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
