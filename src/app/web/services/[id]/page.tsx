"use client";

import { use, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { scanTypes, bodyParts, branches } from "@/lib/data";
import { ArrowLeft, Clock, DollarSign, Info, Calendar, MapPin, CheckCircle2 } from "lucide-react";

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const service = useMemo(() =>
    scanTypes.find(s => s.id === id),
    [id]
  );

  const procedures = useMemo(() =>
    bodyParts.filter(b => b.scanTypeId === id),
    [id]
  );

  if (!service) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-secondary mb-4">Service Not Found</h1>
        <Link href="/web/scans" className="text-primary font-bold hover:underline">Back to All Services</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero */}
      <section className="relative h-[500px] flex items-center justify-center text-white">
        <div className="absolute inset-0">
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="object-cover brightness-[0.3]"
            priority
          />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <Link href="/web/scans" className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] mb-8 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> All Services
          </Link>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic mb-6">
            {service.name}
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto italic font-medium">
            {service.description}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-3xl font-black text-secondary tracking-tighter uppercase italic mb-8 underline decoration-primary decoration-4 underline-offset-8">Available Procedures</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {procedures.map((p) => (
                <div key={p.id} className="p-8 rounded-[40px] border-2 border-slate-50 bg-white hover:border-primary transition-all group">
                  <h3 className="text-xl font-black text-secondary mb-4 italic uppercase">{p.name}</h3>
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-slate-500">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-xs font-bold uppercase tracking-widest">{p.duration}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="text-xs font-bold uppercase tracking-widest">${p.price}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="h-3 w-3 text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Preparation</span>
                    </div>
                    <p className="text-xs text-slate-600 italic leading-relaxed">{p.preparation}</p>
                  </div>
                  <Link
                    href={`/book?scanId=${p.id}`}
                    className="mt-8 w-full bg-secondary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 group-hover:bg-primary transition-all"
                  >
                    Book Now <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
            {procedures.length === 0 && (
               <div className="p-12 rounded-[40px] bg-slate-50 border-2 border-dashed border-slate-200 text-center">
                  <p className="text-slate-400 font-black uppercase tracking-widest italic">Contact us for specific procedure details and pricing.</p>
               </div>
            )}
          </section>

          <section>
             <h2 className="text-3xl font-black text-secondary tracking-tighter uppercase italic mb-8">Clinical Preparation Guide</h2>
             <div className="bg-white rounded-[50px] border-4 border-slate-50 shadow-xl overflow-hidden">
                <div className="p-10 bg-primary text-white flex items-center gap-6 italic">
                   <div className="p-4 bg-white/20 rounded-2xl shadow-inner"><Info className="h-8 w-8" /></div>
                   <div>
                      <h3 className="text-2xl font-black uppercase tracking-tighter">Protocol Readiness</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Ensuring optimal image fidelity</p>
                   </div>
                </div>
                <div className="p-12 space-y-8">
                   {[
                     { title: "Arrival Node", desc: "Arrive at your selected branch at least 15 minutes prior to your diagnostic slot for electronic check-in." },
                     { title: "Clinical Attire", desc: "Wear loose, comfortable clothing. Avoid metallic accessories (zippers, jewelry) as they may interfere with imaging sensors." },
                     { title: "Medication Log", desc: "Continue regular medications unless specifically instructed otherwise by your referring clinician." },
                     { title: "Hydration Sync", desc: "For ultrasound procedures, maintain a high hydration level as instructed by the clinical coordinator." }
                   ].map((item, i) => (
                     <div key={i} className="flex gap-8 group">
                        <div className="text-4xl font-black text-slate-100 group-hover:text-primary transition-colors italic leading-none shrink-0">0{i+1}</div>
                        <div>
                           <p className="font-black text-secondary uppercase tracking-tighter text-lg italic mb-2">{item.title}</p>
                           <p className="text-slate-500 italic text-sm leading-relaxed">{item.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </section>

          <section className="bg-slate-900 text-white p-12 rounded-[50px] relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-10 scale-150 rotate-12"><CheckCircle2 className="h-40 w-40 text-primary" /></div>
             <div className="relative z-10">
                <h2 className="text-3xl font-black tracking-tighter uppercase italic mb-8">Why Choose Grace?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {[
                     "Latest high-resolution diagnostic equipment",
                     "Expert radiologists with years of experience",
                     "Results delivered securely via our patient portal",
                     "Comfortable and patient-friendly environment",
                     "Strict adherence to international safety standards",
                     "Fast results for urgent diagnostic needs"
                   ].map((item, i) => (
                     <div key={i} className="flex items-start gap-4">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-1" />
                        <p className="text-slate-300 italic font-medium leading-relaxed">{item}</p>
                     </div>
                   ))}
                </div>
             </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div className="p-10 rounded-[45px] bg-primary text-white shadow-xl shadow-primary/20">
             <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-6">Need Assistance?</h3>
             <p className="text-white/80 italic font-medium mb-8 leading-relaxed">Our specialists are available to answer any questions about your upcoming procedure.</p>
             <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl">
                   <Calendar className="h-5 w-5" />
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Consultation</p>
                      <p className="text-sm font-bold">Mon - Sat: 8am - 8pm</p>
                   </div>
                </div>
                <Link href="/web/book" className="block w-full bg-white text-secondary py-5 rounded-2xl font-black uppercase tracking-widest text-xs text-center hover:bg-slate-100 transition-all">
                  Schedule Call
                </Link>
             </div>
          </div>

          <div className="p-10 rounded-[45px] border-2 border-slate-50 bg-white">
             <h3 className="text-xl font-black text-secondary uppercase italic tracking-tighter mb-8">Available Nodes</h3>
             <div className="space-y-6">
                {branches.map(b => (
                  <div key={b.id} className="flex items-start gap-4 pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                     <MapPin className="h-5 w-5 text-primary shrink-0 mt-1" />
                     <div>
                        <p className="font-black text-secondary text-sm uppercase italic">{b.name.split("-")[1]?.trim() || b.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{b.address}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size} height={size}
      viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M5 12h14"></path>
      <path d="m12 5 7 7-7 7"></path>
    </svg>
  );
}
