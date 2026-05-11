"use client";

import { ShieldCheck, Award, Target, Eye, Heart, Users, Activity, Microscope } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function AboutPage() {
  const stats = [
    { label: "Patients Served", value: "50,000+", icon: Users },
    { label: "Accuracy Rate", value: "99.9%", icon: Activity },
    { label: "Radiologists", value: "12", icon: Microscope },
    { label: "Awards Won", value: "5", icon: Award },
  ];

  const values = [
    {
      title: "Precision",
      desc: "We utilize state-of-the-art diagnostic technology to ensure the highest level of image clarity and diagnostic accuracy.",
      icon: Target,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Compassion",
      desc: "Our patients are at the heart of everything we do. We provide a supportive and caring environment for every individual.",
      icon: Heart,
      color: "bg-red-50 text-red-600"
    },
    {
      title: "Efficiency",
      desc: "We understand that time is critical in diagnosis. We deliver results with speed without compromising on thoroughness.",
      icon: ShieldCheck,
      color: "bg-green-50 text-green-600"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-secondary">
        <div className="absolute inset-0 z-0">
           <Image
             src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop"
             fill
             className="w-full h-full object-cover opacity-30 scale-105"
             alt="Modern Hospital Hallway"
             priority
           />
           <div className="absolute inset-0 bg-gradient-to-b from-secondary/80 to-secondary" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
           <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/20 rounded-full border border-primary/30 mb-8 backdrop-blur-md">
              <Award className="h-5 w-5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">Award-Winning Diagnostic Care</span>
           </div>
           <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic mb-8">
              Pioneering <span className="text-primary not-italic">Clinical</span> Excellence
           </h1>
           <p className="text-xl text-slate-300 font-medium italic max-w-2xl mx-auto leading-relaxed">
              At Grace Diagnostic Centre, we blend cutting-edge technology with human compassion to deliver &quot;Fast, Clear, and Accurate Images&quot; that save lives.
           </p>
        </div>
      </section>

      {/* Legacy Section */}
      <section className="py-32 px-4">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
               <div className="aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl relative z-10 border-[12px] border-white">
                  <Image
                    src="https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop"
                    width={800}
                    height={1000}
                    className="w-full h-full object-cover"
                    alt="Radiology Professional"
                  />
               </div>
               <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary rounded-[50px] -z-0 rotate-12 flex items-center justify-center p-10 text-white">
                  <div className="text-center">
                     <Award className="h-16 w-16 mx-auto mb-4" />
                     <p className="font-black uppercase tracking-tighter italic text-2xl leading-none">Outstanding Experience Award</p>
                  </div>
               </div>
            </div>

            <div className="space-y-12">
               <div>
                  <h2 className="text-5xl font-black text-secondary tracking-tighter uppercase italic mb-8">Our Legacy of Quality</h2>
                  <p className="text-lg text-slate-500 leading-relaxed italic">
                    Founded with a vision to revolutionize diagnostic medicine in Ghana, Grace Diagnostic Centre has grown from a single facility to a multi-node network of excellence. We pride ourselves on our speed—often delivering X-ray results in less than 1 hour—and our unwavering commitment to accuracy.
                  </p>
               </div>

               <div className="grid grid-cols-2 gap-8">
                  {stats.map((stat, i) => (
                    <div key={i} className="p-8 rounded-[40px] bg-slate-50 border-2 border-slate-100 group hover:border-primary transition-all">
                       <stat.icon className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                       <p className="text-4xl font-black text-secondary tracking-tighter italic mb-1">{stat.value}</p>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-32 bg-secondary text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 p-32 opacity-5 pointer-events-none italic font-black text-[20rem] leading-none">GRACE</div>
         <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
               <div className="space-y-8 p-12 bg-white/5 rounded-[60px] border border-white/10 backdrop-blur-sm">
                  <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/20">
                     <Target className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-4xl font-black italic tracking-tighter uppercase">Our Mission</h3>
                  <p className="text-slate-400 text-lg leading-relaxed italic">
                    To provide world-class diagnostic services that empower clinicians and patients with timely, clear, and precise medical intelligence, fostering a healthier future for all communities we serve.
                  </p>
               </div>

               <div className="space-y-8 p-12 bg-white/5 rounded-[60px] border border-white/10 backdrop-blur-sm">
                  <div className="w-20 h-20 bg-blue-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
                     <Eye className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-4xl font-black italic tracking-tighter uppercase">Our Vision</h3>
                  <p className="text-slate-400 text-lg leading-relaxed italic">
                    To become the premier diagnostic gateway in West Africa, recognized for technological innovation, clinical integrity, and an unparalleled patient experience.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* Infrastructure Gallery */}
      <section className="py-32 overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 mb-20 flex justify-between items-end">
            <div>
               <h2 className="text-5xl font-black text-secondary tracking-tighter uppercase italic">Our <span className="text-primary not-italic">Infrastructure</span></h2>
               <p className="text-slate-400 italic mt-4">Precision hardware and professional environments.</p>
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2070&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2073&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2069&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1583912267550-d44d7a125821?q=80&w=2070&auto=format&fit=crop"
            ].map((img, i) => (
              <div key={i} className="h-[400px] rounded-[40px] overflow-hidden shadow-2xl relative group">
                 <Image
                    src={img}
                    fill
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt="Diagnostic Infrastructure"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-10">
                    <p className="text-white font-black uppercase tracking-[0.2em] italic text-xs">Node Architecture</p>
                 </div>
              </div>
            ))}
         </div>
      </section>

      {/* Values */}
      <section className="py-32 px-4 bg-slate-50">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
               <h2 className="text-5xl font-black text-secondary tracking-tighter uppercase italic mb-6">Our Core Values</h2>
               <div className="w-24 h-2 bg-primary mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {values.map((val, i) => (
                 <div key={i} className="bg-white p-12 rounded-[50px] shadow-xl hover:-translate-y-4 transition-all duration-500 border border-slate-100 group">
                    <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center mb-8 shadow-inner transition-transform group-hover:rotate-12", val.color)}>
                       <val.icon className="h-10 w-10" />
                    </div>
                    <h4 className="text-2xl font-black text-secondary italic tracking-tighter uppercase mb-4">{val.title}</h4>
                    <p className="text-slate-500 leading-relaxed italic">{val.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
}
