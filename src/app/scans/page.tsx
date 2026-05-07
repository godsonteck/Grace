"use client";

import { useState, useMemo } from "react";
import { scanTypes, bodyParts } from "@/lib/data";
import { Search, Filter, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ScansPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filteredBodyParts = useMemo(() => {
    return bodyParts.filter((part) => {
      const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          part.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType ? part.scanTypeId === selectedType : true;
      return matchesSearch && matchesType;
    });
  }, [searchTerm, selectedType]);

  const groupedParts = useMemo(() => {
    const groups: Record<string, typeof bodyParts> = {};
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
          Browse our complete list of imaging services categorized by scan type and body part.
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
      <div className="space-y-12">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {partsInType.length > 0 ? (
                    partsInType.map((part) => (
                      <div
                        key={part.id}
                        className="group p-4 border rounded-xl bg-white hover:border-primary hover:shadow-md transition-all flex justify-between items-center"
                      >
                        <div>
                          <h3 className="font-semibold text-secondary group-hover:text-primary transition-colors">
                            {part.name}
                          </h3>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                            {part.category}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-primary transition-colors" />
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
    </div>
  );
}
