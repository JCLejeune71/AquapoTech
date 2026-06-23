import React, { useState } from 'react';
import { Calendar, Filter, Waves, Thermometer, Droplets, Activity, Eye, Zap } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export default function HistoryChart({ historique }) {
  
  // 1. Uniformisation et formatage ultra-robuste des données de la base
  const historiqueFormate = (historique || []).map(point => {
    const nomSonde = point.nom_sonde || point.nomSonde || point.nom || point.device_name || point.deviceName || "Sonde Inconnue";
    const hauteur = point.hauteur_eau !== undefined ? point.hauteur_eau : (point.hauteurEau !== undefined ? point.hauteurEau : point.hauteur);

    return {
      ...point,
      nom: nomSonde,
      temperature: point.temperature !== null ? Number(point.temperature) : null,
      humidite: point.humidite !== null ? Number(point.humidite) : null,
      hauteurEau: hauteur !== null ? Number(hauteur) : null,
      ph: point.ph !== null ? Number(point.ph) : null,
      
      // Nouvelles colonnes
      oxygene: point.oxygene !== undefined && point.oxygene !== null ? Number(point.oxygene) : null,
      ec: point.ec !== undefined && point.ec !== null ? Number(point.ec) : null,
      
      heureStr: point.date_mesure ? new Date(point.date_mesure).toLocaleDateString([], {day: 'numeric', month: 'short'}) + ' ' + new Date(point.date_mesure).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''
    };
  });

  // 2. Extraction des sondes présentes
  const listeCuves = Array.from(new Set(historiqueFormate.map((m) => m.nom))).filter(Boolean);
  const [cuveSelectionnee, setCuveSelectionnee] = useState('toutes');

  // 3. Filtrage et inversion pour l'ordre chronologique de gauche à droite
  const donneesFiltrees = (cuveSelectionnee === 'toutes'
    ? historiqueFormate
    : historiqueFormate.filter((m) => m.nom === cuveSelectionnee)).reverse();

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm space-y-6">
      
      {/* BARRE D'ENTÊTE ET FILTRES */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/60 pb-4">
        <div>
          <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <Calendar size={18} className="text-indigo-400" /> 
            Historique Analytique Avancé
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivi des constantes biologiques {cuveSelectionnee !== 'toutes' ? `pour ${cuveSelectionnee}` : 'globales'}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 w-full sm:w-auto">
          <Filter size={14} className="text-slate-400" />
          <select
            value={cuveSelectionnee}
            onChange={(e) => setCuveSelectionnee(e.target.value)}
            className="bg-transparent text-xs text-white focus:outline-none cursor-pointer font-mono pr-4 w-full sm:w-auto"
          >
            <option value="toutes" className="bg-slate-900 text-white">📦 Toutes les cuves</option>
            {listeCuves.map((nomCuve) => (
              <option key={nomCuve} value={nomCuve} className="bg-slate-900 text-white">🪣 {nomCuve}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ZONE DU GRAPHIQUE */}
      {donneesFiltrees.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">
          En attente de données du simulateur...
        </div>
      ) : (
        <div className="space-y-4">
          <div className="h-96 w-full bg-slate-950/40 rounded-2xl border border-slate-800/50 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={donneesFiltrees} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                <XAxis dataKey="heureStr" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '16px' }}
                  labelStyle={{ color: '#64748b', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '15px' }} />
                
                {/* COURBES TRADITIONNELLES */}
                <Line name="Niveau Eau (cm)" type="monotone" dataKey="hauteurEau" stroke="#3b82f6" strokeWidth={2} dot={false} connectNulls />
                <Line name="Température (°C)" type="monotone" dataKey="temperature" stroke="#f97316" strokeWidth={2} dot={false} connectNulls />
                <Line name="Humidité (%)" type="monotone" dataKey="humidite" stroke="#06b6d4" strokeWidth={1} strokeDasharray="4 4" dot={false} connectNulls />
                <Line name="pH" type="monotone" dataKey="ph" stroke="#10b981" strokeWidth={2.5} dot={false} connectNulls />
                
                {/* NOUVELLES COURBES SÉCURISÉES */}
                <Line name="Oxygène Dissous (mg/L)" type="monotone" dataKey="oxygene" stroke="#ec4899" strokeWidth={2} dot={false} connectNulls />
                <Line name="Conductivité EC (mS/cm)" type="monotone" dataKey="ec" stroke="#a855f7" strokeWidth={2} dot={false} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* BARRE DE LÉGENDE TECHNIQUE INFÉRIEURE */}
          <div className="text-[11px] font-mono text-slate-400 bg-slate-950/20 p-3 rounded-xl border border-slate-800/40 flex flex-col sm:flex-row justify-between items-center gap-2">
            <span>Points synchronisés : <strong className="text-emerald-400">{donneesFiltrees.length}</strong></span>
            <div className="flex flex-wrap gap-3 text-slate-500">
              <span className="flex items-center gap-1"><Thermometer size={10} className="text-orange-400" /> Temp</span>
              <span className="flex items-center gap-1"><Droplets size={10} className="text-cyan-400" /> Hum</span>
              <span className="flex items-center gap-1"><Waves size={10} className="text-blue-400" /> Eau</span>
              <span className="flex items-center gap-1"><Activity size={10} className="text-emerald-400" /> pH</span>
              <span className="flex items-center gap-1"><Eye size={10} className="text-pink-400" /> $O_2$</span>
              <span className="flex items-center gap-1"><Zap size={10} className="text-purple-400" /> EC</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}