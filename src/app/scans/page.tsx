"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { scanTypes, bodyParts as initialBodyParts, BodyPart } from "@/lib/data";
import { Search, ChevronRight, Clock, Info, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

function ScansContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [activePart, setActivePart] = useState<BodyPart | null>(null);
  const [records, setRecords] = useState<BodyPart[]>(initialBodyParts);

  // Load records from localStorage to ensure sync with Admin changes
  useEffect(() => {
    const savedRecords = localStorage.getItem("grace_records");
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  }, []);

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
    const groups: Record<string, typeof records> = {};
    filteredBodyParts.forEach((part) => {
      if (!groups[part.scanTypeId]) {
        groups[part.scanTypeId] = [];
      }
      groups[part.scanTypeId].push(part);
    });
    return groups;
  }, [filteredBodyParts]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-secondary mb-4">Diagnostic Scans</h1>
        <p className="text-muted text-lg">
          Browse our complete list of imaging services. Click on a procedure to see duration and preparation details.
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
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => setSelectedType(null)}
            className={cn(
              "px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all",
              selectedType === null
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "bg-white border border-slate-200 text-secondary hover:border-primary"
            )}
          >
            All Scans
          </button>
          {scanTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={cn(
                "px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all",
                selectedType === type.id
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white border border-slate-200 text-secondary hover:border-primary"
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
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-secondary">{type.name}</h2>
                    <div className="h-px flex-grow bg-slate-100" />
                    <span className="text-sm font-medium text-muted-foreground bg-slate-100 px-3 py-1 rounded-full">
                      {partsInType.length} parts
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {partsInType.length > 0 ? (
                      partsInType.map((part) => (
                        <div
                          key={part.id}
                          onClick={() => setActivePart(part)}
                          className={cn(
                            "group p-4 border rounded-xl bg-white hover:border-primary hover:shadow-md transition-all flex justify-between items-center cursor-pointer",
                            activePart?.id === part.id ? "border-primary ring-2 ring-primary/10 shadow-md" : "border-slate-100"
                          )}
                        >
                          <div>
                            <h3 className={cn(
                              "font-semibold transition-colors",
                              activePart?.id === part.id ? "text-primary" : "text-secondary group-hover:text-primary"
                            )}>
                              {part.name}
                            </h3>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                              {part.category}
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
                      <span className="text-2xl font-bold text-secondary">${activePart.price}</span>
                    </div>
                    <button
                      onClick={() => router.push(`/book?scanId=${activePart.id}`)}
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
