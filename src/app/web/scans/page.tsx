"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { scanTypes, BodyPart } from "@/lib/data";
import { useData } from "@/context/DataContext";
import { Search, ChevronRight, Clock, Info, Calendar, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

function ScansContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { records } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [activePart, setActivePart] = useState<BodyPart | null>(null);

  useEffect(() => {
    const type = searchParams.get("type");
    if (type) {
      setSelectedType(type);
    }
  }, [searchParams]);

  const filteredBodyParts = useMemo(() => {
    return records.filter((part) => {
      const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          part.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType ? part.scanTypeId === selectedType : true;
      return matchesSearch && matchesType;
    });
  }, [searchTerm, selectedType, records]);

  const groupedParts = useMemo(() => {
    const groups: Record<string, BodyPart[]> = {};
    filteredBodyParts.forEach((part) => {
      if (!groups[part.scanTypeId]) {
        groups[part.scanTypeId] = [];
      }
      groups[part.scanTypeId].push(part);
    });
    return groups;
  }, [filteredBodyParts]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      <div className="mb-16">
        <h1 className="text-5xl font-black text-secondary mb-6 tracking-tighter uppercase italic underline decoration-primary decoration-8 underline-offset-8">Procedure Catalog</h1>
        <p className="text-slate-400 text-lg italic font-medium max-w-2xl">
          Browse our complete list of synchronized medical imaging services across the Grace Diagnostic network.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search body parts or categories..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
          <div className="flex gap-3 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
          <button
            onClick={() => setSelectedType(null)}
            className={cn(
                "px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] whitespace-nowrap transition-all italic",
              selectedType === null
                  ? "bg-primary text-white shadow-xl shadow-primary/20"
                  : "bg-white border-2 border-slate-50 text-slate-400 hover:border-primary hover:text-primary"
            )}
          >
              All Protocols
          </button>
          {scanTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={cn(
                  "px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] whitespace-nowrap transition-all italic",
                selectedType === type.id
                    ? "bg-primary text-white shadow-xl shadow-primary/20"
                    : "bg-white border-2 border-slate-50 text-slate-400 hover:border-primary hover:text-primary"
              )}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {scanTypes
            .filter(type => !selectedType || type.id === selectedType)
            .map((type) => {
              const partsInType = groupedParts[type.id] || [];
              if (partsInType.length === 0 && searchTerm) return null;

              return (
                <div key={type.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-6 mb-8">
                    <h2 className="text-3xl font-black text-secondary uppercase italic tracking-tighter">{type.name}</h2>
                    <div className="h-2 flex-grow bg-slate-50 rounded-full" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] italic bg-primary/5 px-4 py-2 rounded-xl">
                      {partsInType.length} Acquisition Nodes
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {partsInType.length > 0 ? (
                      partsInType.map((part) => (
                        <div
                          key={part.id}
                          onClick={() => setActivePart(part)}
                          className={cn(
                            "group p-6 border-2 rounded-[35px] bg-white hover:border-primary hover:shadow-2xl transition-all flex justify-between items-center cursor-pointer relative overflow-hidden",
                            activePart?.id === part.id ? "border-primary ring-4 ring-primary/5 shadow-2xl" : "border-slate-50"
                          )}
                        >
                          {activePart?.id === part.id && <div className="absolute top-0 right-0 p-3"><CheckCircle className="h-4 w-4 text-primary" /></div>}
                          <div>
                            <h3 className={cn(
                              "text-lg font-black uppercase italic tracking-tighter transition-colors",
                              activePart?.id === part.id ? "text-primary" : "text-secondary group-hover:text-primary"
                            )}>
                              {part.name}
                            </h3>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 italic">
                              {part.category} NODE
                            </p>
                          </div>
                          <ChevronRight className={cn(
                            "h-5 w-5 transition-colors",
                            activePart?.id === part.id ? "text-primary" : "text-slate-300 group-hover:text-primary"
                          )} />
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground italic col-span-full">No body parts found matching your search.</p>
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Info Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            {activePart ? (
              <div className="bg-white rounded-3xl border shadow-xl shadow-slate-200/50 p-8 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                    <Info className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-secondary">{activePart.name}</h3>
                    <p className="text-sm text-primary font-medium">{scanTypes.find(t => t.id === activePart.scanTypeId)?.name}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-secondary">Estimated Duration</p>
                      <p className="text-sm text-muted">{activePart.duration || "15-20 minutes"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-secondary">Preparation</p>
                      <p className="text-sm text-muted leading-relaxed">
                        {activePart.preparation || "No special preparation required. Please wear comfortable clothing without metal fasteners."}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-sm font-medium text-slate-500">Service Fee</span>
                      <span className="text-2xl font-bold text-secondary">GH₵{activePart.price.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => router.push(`/web/book?scanId=${activePart.id}`)}
                      className="w-full bg-secondary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-secondary/20"
                    >
                      <Calendar className="h-5 w-5" />
                      Book This Scan
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-3xl border border-dashed border-slate-300 p-12 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Info className="h-8 w-8" />
                </div>
                <p className="text-slate-500 font-medium">Select a scan to view detailed information and preparation requirements.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ScansPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        <div className="h-10 w-64 bg-slate-200 rounded mb-4" />
        <div className="h-6 w-96 bg-slate-100 rounded mb-12" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div className="h-64 bg-slate-50 rounded-3xl border" />
          </div>
        </div>
      </div>
    }>
      <ScansContent />
    </Suspense>
  );
}
