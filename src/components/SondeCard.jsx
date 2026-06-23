import React from 'react';
import { Thermometer, Droplets, Activity, Waves, Battery, Trash2, Eye, Zap, Signal } from 'lucide-react';
import PhGauge from "./pHGauge";
import { CONFIG_SONDES_OFFICIELLES, CONFIG_PAR_DEFAUT } from "../config/sondesConfig";

export default function SondeCard({ sonde, viewMode, seuilPoisson = 22 }) {
  
  // 1. EXTRACTION DE LA CONFIGURATION
  const configSonde = sonde.configPerso || CONFIG_SONDES_OFFICIELLES[sonde.nom] || CONFIG_PAR_DEFAUT;
  const { hauteurMax, hauteurAlerteBasse } = configSonde;

  // 2. CALCULS POUR L'HUMIDITÉ
  const hStable = sonde.humidite !== "--" && !isNaN(Number(sonde.humidite)) ? Number(sonde.humidite) : 0;
  const barHeight = Math.min(Math.max(hStable, 0), 100);

  // 3. CALCULS POUR LA HAUTEUR D'EAU
  const eauStable = sonde.hauteurEau !== "--" && !isNaN(Number(sonde.hauteurEau)) ? Number(sonde.hauteurEau) : 0;
  const eauPourcentage = Math.min(Math.max((eauStable / hauteurMax) * 100, 0), 100);    

  // 4. Détection des alertes
  const tempNum = !isNaN(Number(sonde.temperature)) ? Number(sonde.temperature) : 0;
  const alerteTemp = tempNum > seuilPoisson;

  const phNum = !isNaN(Number(sonde.ph)) ? Number(sonde.ph) : 7;
  const alertePh = phNum < 6.0 || phNum > 7.5; 

  const alerteEauBasse = sonde.hauteurEau !== "--" && eauStable < hauteurAlerteBasse;

  // 5. Gestion de l'affichage selon l'onglet
  const showTemp = viewMode === 'tous' || viewMode === 'temperature' || (viewMode === 'alertes' && alerteTemp);
  const showHumidite = viewMode === 'tous' || viewMode === 'humidite';
  const showPh = viewMode === 'tous' || viewMode === 'ph' || (viewMode === 'alertes' && alertePh);
  const showEau = viewMode === 'tous' || viewMode === 'eau' || (viewMode === 'alertes' && alerteEauBasse);
  const showOxygene = viewMode === 'tous' || viewMode === 'oxygene';
  const showEc = viewMode === 'tous' || viewMode === 'ec';

  // Si on est dans l'onglet Alertes et qu'aucune alerte n'est active, on masque la carte
  if (viewMode === 'alertes' && !alerteTemp && !alertePh && !alerteEauBasse) {
    return null;
  }

  return (
    <div className={`bg-slate-900/50 border rounded-3xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm transition-all duration-300 space-y-4 ${
      viewMode === 'alertes' ? 'border-red-900 bg-red-950/5' : 'border-slate-800/80 hover:border-slate-700'
    }`}>
      
      {/* Entête de la Carte */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800/60 pb-4">
        <div>
            <h3 className="text-xl font-black text-white tracking-tight break-words">{sonde.nom}</h3>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">MÀJ: {sonde.date}</p>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800/60 text-xs font-mono w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-1.5 text-slate-300">
            <Signal size={13} className="text-slate-500" />
            <span>{sonde.rssi} <span className="text-[10px] text-slate-500">dBm</span></span>
            </div>
            <div className="h-3 w-[1px] bg-slate-800 hidden sm:block"></div>
            <div className="flex items-center gap-1.5 text-slate-300">
            <Battery size={13} className="text-emerald-500" />
            <span>{sonde.batterie}%</span>
            </div>
        </div>
        </div>

      {/* GRILLE - Température & Humidité */}
      <div className={`grid gap-4 ${showTemp && showHumidite ? 'grid-cols-2' : 'grid-cols-1'}`}>
        
        {/* BLOC TEMPÉRATURE */}
        {showTemp && (
          <div className={`bg-slate-950/40 border rounded-2xl p-4 flex flex-col justify-between group transition-all duration-300 h-32 relative overflow-hidden ${
            alerteTemp ? 'border-red-500/80 bg-red-950/30 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse' : 'border-slate-800/40'
          }`}>
            <div className="flex justify-between items-center w-full">
              <span className={`text-[10px] font-bold tracking-wider uppercase ${alerteTemp ? 'text-red-400' : 'text-slate-500'}`}>
                Température Eau
              </span>
              <div className={`p-1.5 rounded-lg ${alerteTemp ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/10 text-orange-400'}`}>
                <Thermometer size={16} className={alerteTemp ? 'animate-bounce' : ''} />
              </div>
            </div>
            <span className={`text-3xl font-black tracking-tight font-mono mb-1 ${alerteTemp ? 'text-red-400' : 'text-white'}`}>
              {sonde.temperature} <span className="text-sm font-medium text-slate-500">°C</span>
            </span>
            {alerteTemp && (
              <span className="absolute bottom-2 right-2 text-[9px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                ⚠️ Stress Poissons ({'>'}{seuilPoisson}°C)
              </span>
            )}
          </div>
        )}

        {/* BLOC HUMIDITÉ */}
        {showHumidite && (
          <div className="bg-slate-950/40 border border-slate-800/40 rounded-2xl p-4 flex items-center justify-between group hover:border-cyan-500/20 transition-colors h-32">
            <div className="flex flex-col justify-between h-full">
              <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1">
                <Droplets size={12} className="text-cyan-400" /> Humidité Serre
              </span>
              <span className="text-3xl font-black tracking-tight text-white font-mono mb-1">
                {sonde.humidite} <span className="text-sm font-medium text-slate-500">%</span>
              </span>
            </div>
            <div className="h-full w-4 bg-slate-900 rounded-full border border-slate-800 relative overflow-hidden flex items-end shadow-inner">
              <div className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-b-full transition-all duration-500" style={{ height: `${barHeight}%` }}></div>
            </div>
          </div>
        )}
      </div>

      {/* BLOC HAUTEUR D'EAU */}
      {showEau && (
        <div className={`bg-slate-950/40 border rounded-2xl p-4 flex items-center justify-between group transition-colors h-32 relative overflow-hidden ${
          alerteEauBasse ? 'border-red-500/80 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.15)] animate-pulse' : 'border-slate-800/40 hover:border-blue-500/20'
        }`}>
          <div className="flex flex-col justify-between h-full">
            <span className={`text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 ${alerteEauBasse ? 'text-red-400' : 'text-slate-500'}`}>
              <Waves size={12} className={alerteEauBasse ? 'text-red-400 animate-bounce' : 'text-blue-400'} /> 
              Niveau Cuve {alerteEauBasse && '— CRITIQUE ⚠️'}
            </span>
            <span className={`text-3xl font-black tracking-tight font-mono mb-1 ${alerteEauBasse ? 'text-red-400' : 'text-white'}`}>
              {sonde.hauteurEau} <span className="text-xs font-medium text-slate-500">/ {hauteurMax} cm</span>
            </span>
          </div>
          
          <div className="h-full w-8 bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden flex items-end shadow-inner">
            <div 
              className={`w-full transition-all duration-500 ${alerteEauBasse ? 'bg-gradient-to-t from-red-600 to-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-gradient-to-t from-blue-700 to-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]'}`}
              style={{ height: `${eauPourcentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* BLOC PH */}
      {showPh && (
        <div className={`bg-slate-950/40 border rounded-2xl p-4 flex flex-col items-center relative overflow-hidden pt-3 transition-colors ${
          alertePh ? 'border-amber-500/60 bg-amber-950/10' : 'border-slate-800/40'
        }`}>
          <div className="w-full flex justify-between items-center px-2 mb-2">
            <span className={`text-[10px] font-bold tracking-wider uppercase ${alertePh ? 'text-amber-400 font-extrabold' : 'text-slate-500'}`}>
              Analyse Solution {alertePh ? '— PH INSTABLE ⚠️' : '(pH)'}
            </span>
            <span className={`text-lg font-black font-mono border px-2 py-0.5 rounded-lg ${
              alertePh ? 'text-amber-400 bg-amber-950 border-amber-500' : 'text-white bg-slate-900/80 border-slate-800'
            }`}>
               {sonde.ph}
            </span>
          </div>
          <PhGauge value={sonde.ph} />
        </div>
      )}

      {/* NOUVELLE GRILLE INFERIEURE - Oxygène & EC */}
      <div className={`grid gap-4 ${(showOxygene || showEc) ? (showOxygene && showEc ? 'grid-cols-2' : 'grid-cols-1') : 'hidden'}`}>
        {/* BLOC OXYGÈNE DISSOUS */}
        {showOxygene && (
          <div className="bg-slate-950/40 border border-slate-800/60 p-4 rounded-2xl flex items-center justify-between h-24">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                <Eye size={12} className="text-pink-400" /> Oxygène O₂
              </span>
              <div className="text-xl font-mono font-black text-white">
                {sonde.oxygene !== undefined && sonde.oxygene !== '--' ? `${Number(sonde.oxygene).toFixed(1)}` : '--'} 
                <span className="text-xs text-slate-500 font-normal ml-0.5">mg/L</span>
              </div>
            </div>
          </div>
        )}

        {/* BLOC CONDUCTIVITÉ (EC) */}
        {showEc && (
          <div className="bg-slate-950/40 border border-slate-800/60 p-4 rounded-2xl flex items-center justify-between h-24">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                <Zap size={12} className="text-purple-400" /> Conductivité EC
              </span>
              <div className="text-xl font-mono font-black text-white">
                {sonde.ec !== undefined && sonde.ec !== '--' ? `${Number(sonde.ec).toFixed(2)}` : '--'} 
                <span className="text-xs text-slate-500 font-normal ml-0.5">mS/cm</span>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}