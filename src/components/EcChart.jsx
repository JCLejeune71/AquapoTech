import React, { useState } from 'react';
import { Filter, Zap } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function EcChart({ historique }) {
  const historiqueFormate = (historique || []).map(point => ({
    ...point,
    nom: point.nom_sonde || point.nom || "Sonde Inconnue",
    ec: point.ec !== undefined && point.ec !== null ? Number(point.ec) : null,
    heureStr: point.date_mesure ? new Date(point.date_mesure).toLocaleDateString([], {day: 'numeric', month: 'short'}) + ' ' + new Date(point.date_mesure).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''
  }));

  const listeCuves = Array.from(new Set(historiqueFormate.map((m) => m.nom))).filter(Boolean);
  const [cuveSelectionnee, setCuveSelectionnee] = useState('toutes');

  const donneesFiltrees = (cuveSelectionnee === 'toutes'
    ? historiqueFormate
    : historiqueFormate.filter((m) => m.nom === cuveSelectionnee)).reverse();

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/60 pb-4">
        <div>
          <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <Zap size={18} className="text-purple-400" /> Historique Conductivité Électrique (EC)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Suivi de la charge nutritive en mS/cm</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <Filter size={14} className="text-slate-400" />
          <select value={cuveSelectionnee} onChange={(e) => setCuveSelectionnee(e.target.value)} className="bg-transparent text-xs text-white focus:outline-none cursor-pointer font-mono pr-4">
            <option value="toutes" className="bg-slate-900 text-white">📦 Toutes les cuves</option>
            {listeCuves.map((nomCuve) => <option key={nomCuve} value={nomCuve} className="bg-slate-900 text-white">🪣 {nomCuve}</option>)}
          </select>
        </div>
      </div>

      <div className="h-80 w-full bg-slate-950/40 rounded-2xl border border-slate-800/50 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={donneesFiltrees}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
            <XAxis dataKey="heureStr" stroke="#475569" fontSize={10} tickLine={false} />
            <YAxis stroke="#475569" fontSize={10} tickLine={false} domain={[0, 4]} />
            <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '12px' }} />
            <Line name="EC (mS/cm)" type="monotone" dataKey="ec" stroke="#a855f7" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}