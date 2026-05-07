import Link from "next/link";
import Image from "next/image";
import { scanTypes, branches } from "@/lib/data";
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000"
            alt="Medical Diagnostic"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Expert Diagnostic Imaging for Your Health
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-slate-200">
            Precision diagnosis through state-of-the-art CT, X-Ray, and Ultrasound services at Grace Diagnostic Center.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/scans"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition-all"
            >
              Explore Our Scans <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/branches"
              className="bg-white hover:bg-slate-100 text-secondary px-8 py-3 rounded-full font-semibold transition-all"
            >
              Find a Branch
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary mb-4">Our Imaging Services</h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            We offer a comprehensive range of diagnostic imaging services using the latest technology.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {scanTypes.map((type) => (
            <div key={type.id} className="group border rounded-2xl overflow-hidden hover:shadow-xl transition-all bg-white">
              <div className="relative h-48">
                <Image
                  src={type.image}
                  alt={type.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-secondary">{type.name}</h3>
                <p className="text-muted-foreground mb-4 text-sm line-clamp-3">
                  {type.description}
                </p>
                <Link
                  href={`/scans?type=${type.id}`}
                  className="text-primary font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all"
                >
                  View Body Parts <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-accent py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-secondary mb-6">Why Choose Grace Diagnostic Center?</h2>
              <div className="space-y-4">
                {[
                  "Highly qualified radiologists and technicians",
                  "Latest generation imaging equipment",
                  "Fast and accurate reporting",
                  "Comfortable and patient-friendly environment",
                  "Multiple convenient locations",
                  "Affordable pricing with transparent costs"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                    <span className="text-secondary/80 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-secondary mb-4">Our Branches</h2>
            <p className="text-muted text-lg max-w-2xl">
              Visit us at any of our conveniently located centers.
            </p>
          </div>
          <Link href="/branches" className="text-primary font-bold hover:underline">
            See all branches
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {branches.map((branch) => (
            <div key={branch.id} className="p-6 border rounded-2xl bg-white hover:border-primary transition-colors">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-secondary">{branch.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">{branch.address}</p>
              <div className="text-primary font-medium text-sm">
                {branch.phone}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
