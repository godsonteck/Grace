'use client';

import { branches } from "@/lib/data";
import { MapPin, Phone, Mail, Clock, ShieldCheck, ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function BranchesPage() {
  const [selectedBranchId, setSelectedBranchId] = useState<string>(branches[0].id);
  const selectedBranch = branches.find(b => b.id === selectedBranchId) || branches[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-black text-secondary mb-6 tracking-tighter uppercase italic">Our Regional Nodes</h1>
          <p className="text-slate-400 text-lg max-w-3xl italic font-medium">
            Grace Diagnostic Center serves you across a synchronized network of medical facilities with the same commitment to &quot;Fast, Clear, and Accurate Images&quot;.
          </p>
        </div>

        <div className="w-full md:w-80">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 block italic">Quick Selector</label>
          <div className="relative group">
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="w-full appearance-none bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 font-black text-secondary uppercase italic tracking-tighter focus:outline-none focus:border-primary transition-all cursor-pointer"
            >
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.name.includes("-") ? b.name.split("-")[1] : b.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-primary pointer-events-none group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {branches.map((branch) => (
          <div key={branch.id} id={branch.id} className={`group border-2 rounded-[45px] overflow-hidden bg-white hover:shadow-2xl transition-all ${selectedBranchId === branch.id ? 'border-primary ring-4 ring-primary/10' : 'border-slate-50'}`}>
            <div className="bg-slate-50 p-10 border-b border-slate-100 group-hover:bg-white transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-black text-secondary mb-3 tracking-tighter uppercase italic">
                    {branch.name.includes("-") ? branch.name.split("-")[1].trim() : branch.name}
                  </h2>
                  <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Certified Diagnostic Cluster</span>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border flex items-center justify-center group-hover:bg-primary transition-colors">
                    <MapPin className="h-8 w-8 text-primary group-hover:text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 italic">Location</h3>
                  <div className="flex items-start gap-4">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <span className="text-secondary font-black italic uppercase text-sm leading-relaxed">{branch.address}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 italic">Direct Line</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:border-primary/20 transition-all">
                      <Phone className="h-5 w-5 text-primary shrink-0" />
                      <span className="text-secondary font-black text-lg tracking-tighter italic">
                        {branch.id === "ho-branch" ? "0552 979 091" : branch.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Mail className="h-5 w-5 text-primary shrink-0" />
                      <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">{branch.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 italic">Operating Hours</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <Clock className="h-5 w-5 text-primary shrink-0 mt-1" />
                      <div className="space-y-2">
                        <p className="text-secondary font-black text-xs uppercase tracking-widest italic">Mon - Fri: 8:00 AM - 8:00 PM</p>
                        <p className="text-secondary font-black text-xs uppercase tracking-widest italic">Sat: 9:00 AM - 5:00 PM</p>
                        <p className="text-primary font-black text-xs uppercase tracking-widest italic">Sun: Emergency Only</p>
                      </div>
                    </div>
                  </div>
                </div>
                <Link href={`/book?branchId=${branch.id}`} className="w-full bg-secondary hover:bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 italic shadow-xl shadow-secondary/10">
                  Book at this Node <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-24 bg-slate-900 rounded-[60px] p-12 md:p-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-5 scale-150 rotate-12 italic font-black text-white text-9xl">SUPPORT</div>
        <div className="max-w-3xl relative z-10">
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic mb-8 underline decoration-primary decoration-8 underline-offset-8">Central Intelligence</h2>
          <p className="text-xl text-slate-400 mb-12 italic font-medium leading-relaxed">
            Need guidance on specialized procedures? Our central helpline provides 24/7 technical and clinical support across the entire network.
          </p>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 flex items-center gap-6 flex-1">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-1 italic">Main Helpline</p>
                <p className="text-xl font-black text-white italic tracking-tighter">0555 777 333</p>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 flex items-center gap-6 flex-1">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center border border-white/10">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-1 italic">Official Email</p>
                <p className="text-xl font-black text-white italic tracking-tighter">gracediagnosticgh@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
