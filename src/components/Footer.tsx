import Link from "next/link";
import { Activity, Mail, Phone, MapPin, ShieldCheck, Stethoscope } from "lucide-react";
import { businessInfo } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-secondary text-white py-24 font-sans relative overflow-hidden">
      <div className="absolute top-0 right-0 p-20 opacity-5 scale-150 rotate-12 italic font-black text-white text-9xl pointer-events-none">GRACE</div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-8">
              <Activity className="h-10 w-10 text-primary" />
              <span className="font-black text-3xl tracking-tighter italic uppercase">
                GRACE <span className="text-primary not-italic">DIAGNOSTIC</span>
              </span>
            </div>
            <p className="text-slate-400 text-lg mb-12 italic font-medium leading-relaxed max-w-md">
              &quot;{businessInfo.motto}&quot;. Synchronizing state-of-the-art clinical hardware with regional medical expertise.
            </p>
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/5 rounded-full border border-white/10">
               <ShieldCheck className="h-4 w-4 text-primary" />
               <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 italic">Clinical Excellence Node</span>
            </div>
          </div>
          <div>
            <h3 className="font-black text-sm uppercase tracking-[0.3em] text-white mb-10 italic">Quick Links</h3>
            <ul className="space-y-6 text-sm font-black uppercase tracking-widest italic">
              <li><Link href="/web" className="text-slate-400 hover:text-primary transition-colors">Home Hub</Link></li>
              <li><Link href="/web/scans" className="text-slate-400 hover:text-primary transition-colors">Procedure Catalog</Link></li>
              <li><Link href="/web/branches" className="text-slate-400 hover:text-primary transition-colors">Branch Network</Link></li>
              <li><Link href="/web/results" className="text-slate-400 hover:text-primary transition-colors">Patient Portal</Link></li>
              <li><Link href="/web/refer" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-2 underline decoration-primary decoration-2 underline-offset-4"><Stethoscope className="h-4 w-4" /> Doctor Referral</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-black text-sm uppercase tracking-[0.3em] text-white mb-10 italic">Contact Node</h3>
            <ul className="space-y-6 text-sm font-black italic">
              <li className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span className="text-slate-400 text-[10px] uppercase tracking-widest leading-relaxed">Tantra Hills Roundabout, 211 Mushroom Street, Accra</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-white text-lg tracking-tighter uppercase">{businessInfo.contacts[0]}</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-slate-400 text-[10px] uppercase tracking-widest lowercase">{businessInfo.email}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 mt-20 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 italic">
            &copy; {new Date().getFullYear()} GRACE DIAGNOSTIC CENTER. ALL SYSTEMS OPERATIONAL.
          </p>
          <div className="flex gap-8">
             <Link href="/dashboard/login" className="text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-primary transition-colors italic">System Orchestrator</Link>
             <Link href="/dashboard/pos" className="text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-primary transition-colors italic">Billing Terminal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
