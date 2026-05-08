import Link from "next/link";
import Image from "next/image";
import { scanTypes, branches } from "@/lib/data";
import { ArrowRight, CheckCircle2, MapPin, Activity, ShieldCheck, Microscope } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16 font-sans">
      {/* Hero Section */}
      <section className="relative h-[800px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000"
            alt="Medical Diagnostic"
            fill
            className="object-cover brightness-[0.4] scale-110"
            priority
          />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/20 backdrop-blur-xl rounded-full border border-primary/30 mb-10 animate-in fade-in slide-in-from-top-10 duration-1000">
             <ShieldCheck className="h-5 w-5 text-primary" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Regional Diagnostic excellence</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter italic uppercase leading-none">
            Precision<br/><span className="text-primary not-italic">Diagnosis.</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed italic">
            Harnessing state-of-the-art CT, X-Ray, and Ultrasound technology across our regional nodes in Ho, Achimota, Koforidua, and Tema.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/scans"
              className="bg-primary hover:bg-white hover:text-secondary text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-[0_20px_40px_rgba(200,169,126,0.2)] active:scale-95"
            >
              Explore Procedures <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/branches"
              className="bg-white/10 backdrop-blur-xl hover:bg-white hover:text-secondary text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs transition-all border border-white/20 active:scale-95"
            >
              Network Map
            </Link>
          </div>
        </div>

        {/* Dynamic Node Ticker */}
        <div className="absolute bottom-0 left-0 w-full bg-secondary/80 backdrop-blur-3xl border-t border-white/5 py-8">
           <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12">
              {[
                { label: "Active Nodes", val: "4", icon: MapPin },
                { label: "Uptime", val: "99.9%", icon: Activity },
                { label: "Pipeline", val: "Active", icon: Microscope },
                { label: "Security", val: "SSL-X", icon: ShieldCheck },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-default">
                   <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary transition-colors"><s.icon className="h-5 w-5 text-primary group-hover:text-secondary" /></div>
                   <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">{s.label}</p>
                      <p className="text-xl font-black text-white italic tracking-tighter">{s.val}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full py-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-5xl font-black text-secondary tracking-tighter uppercase italic underline decoration-primary decoration-8 underline-offset-8">Clinical Services</h2>
            <p className="text-slate-400 text-lg mt-8 font-medium italic">
              Advanced medical imaging synthesized with specialist expertise for life-critical diagnostic intelligence.
            </p>
          </div>
          <Link href="/scans" className="text-primary font-black uppercase tracking-[0.2em] text-xs hover:underline italic flex items-center gap-3">
            Full Catalog <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {scanTypes.map((type) => (
            <div key={type.id} className="group rounded-[45px] overflow-hidden hover:shadow-[0_40px_100px_rgba(0,0,0,0.1)] transition-all bg-white border border-slate-100">
              <div className="relative h-64">
                <Image
                  src={type.image}
                  alt={type.name}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60" />
              </div>
              <div className="p-10">
                <h3 className="text-3xl font-black mb-4 text-secondary tracking-tighter uppercase italic">{type.name}</h3>
                <p className="text-slate-400 mb-8 text-sm font-medium leading-relaxed italic line-clamp-2">
                  {type.description}
                </p>
                <Link
                  href={`/scans?type=${type.id}`}
                  className="bg-slate-50 text-secondary px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] inline-flex items-center gap-3 group-hover:bg-primary group-hover:text-white transition-all shadow-sm"
                >
                  View Node <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-secondary py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none scale-[3] rotate-12 italic font-black text-white text-9xl">DIAGNOSTIC</div>
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic mb-12 leading-[1.1]">The Grace<br/><span className="text-primary not-italic underline decoration-white decoration-8 underline-offset-[12px]">Clinical Standard</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  "Specialist Radiologists",
                  "AI-Enhanced Imaging",
                  "Rapid Clinical Turnaround",
                  "Patient-First Care Flow",
                  "Cloud-Synced Records",
                  "Regional Availability"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-default">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 shadow-[0_0_15px_#C8A97E]" />
                    <span className="text-white/80 font-black uppercase tracking-widest text-[10px]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-[550px] rounded-[60px] overflow-hidden shadow-2xl border-8 border-white/5 rotate-2 hover:rotate-0 transition-transform duration-700">
              <Image
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1000"
                alt="Patient Care"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Branches Highlight */}
      <section className="max-w-7xl mx-auto px-8 w-full py-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <h2 className="text-5xl font-black text-secondary tracking-tighter uppercase italic underline decoration-primary decoration-8 underline-offset-8">Regional Nodes</h2>
            <p className="text-slate-400 text-lg mt-8 font-medium italic">
              A distributed network of diagnostic centers providing synchronized medical intelligence.
            </p>
          </div>
          <Link href="/branches" className="text-primary font-black uppercase tracking-[0.2em] text-xs hover:underline italic flex items-center gap-3">
            Expansion Map <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {branches.map((branch) => (
            <div key={branch.id} className="p-10 rounded-[45px] border-2 border-slate-50 bg-white hover:border-primary hover:shadow-2xl transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform"><MapPin className="h-20 w-20 text-secondary" /></div>
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                <MapPin className="h-6 w-6 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-black mb-2 text-secondary tracking-tighter uppercase italic">{branch.name.split("-")[1]}</h3>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest leading-loose mt-4 italic">{branch.address}</p>
              <div className="mt-8 pt-8 border-t border-slate-50">
                 <p className="text-[10px] font-black text-primary uppercase tracking-widest italic">{branch.phone}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
