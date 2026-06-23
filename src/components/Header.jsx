import React from 'react';
import { Radio } from 'lucide-react';

export default function Header({ status }) {
  return (
    <header className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur sticky top-0 z-50 px-6 py-4 md:px-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
          <Radio className="animate-pulse" size={22} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white uppercase">
          AquapoTech <span className="text-indigo-400 font-medium text-sm lowercase">Supervision</span>
        </h1>
      </div>
      
      <div className="flex items-center gap-3 bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800 text-xs shadow-inner">
        <span className={`h-2 w-2 rounded-full ${status === 'Connecté au Pi' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-rose-500'}`}></span>
        <span className="font-mono text-slate-400 tracking-wide">{status}</span>
      </div>
    </header>
  );
}