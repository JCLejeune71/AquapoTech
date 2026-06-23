import React, { useState } from 'react';
import { Calendar, Filter, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { CONFIG_SONDES_OFFICIELLES } from '../config/sondesConfig.js'; // Ajustez le chemin du fichier si nécessaire

const COULEURS_SERRE = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#a855f7', '#6366f1', '#06b6d4'];

export default function GenericParamChart({ historique, parametre, label, unite, domaine }) {
  const [cuveSelectionnee, setCuveSelectionnee] = useState('toutes');

  // Ignorer l'affichage si on est sur la vue globale "tous" ou si l'historique est vide
  if (parametre === 'tous' || !historique) return null;

  // 1. Identification sécurisée des sondes présentes
  //const listeCuves = Array.from(new Set((historique || []).map(p => p.nom || p.nom_sonde))).filter(Boolean);
  const listeCuves = Array.from(
  new Set(
    (historique || []).map(p => {
      const nomBrut = p.nom || p.nom_sonde;
      // Si la sonde est configurée dans React, on prend son nom d'affichage, sinon le nom brut
      return CONFIG_SONDES_OFFICIELLES[nomBrut]?.nomAffichage || nomBrut;
    })
  )
).filter(Boolean);

  // 2. Pivotement et alignement temporel des données
  const pivoterDonnees = () => {
    const groupes = {};

    (historique || []).forEach(point => {
      if (!point) return;

      // Détection de la date (PostgreSQL 'date_heure' ou normalisée 'date_mesure')
      const cibleDate = point.date_mesure || point.date_heure;
      if (!cibleDate) return;
      
      const dateObj = new Date(cibleDate);
      if (isNaN(dateObj.getTime())) return; 

      // Arrondi à la demi-heure la plus proche pour superposer les trames asynchrones
      const minutes = dateObj.getMinutes();
      const minutesArrondies = Math.round(minutes / 30) * 30;
      dateObj.setMinutes(minutesArrondies);
      dateObj.setSeconds(0);
      dateObj.setMilliseconds(0);
      
      const axeXStr = dateObj.toLocaleDateString([], {day: 'numeric', month: 'short'}) + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      //const nomSonde = point.nom || point.nom_sonde || "Zone Inconnue";
      const nomBrut = (point.nom || point.nom_sonde || "Zone Inconnue").trim();

    // On cherche une correspondance dans la config en ignorant la casse (minuscules/majuscules)
        const cleTrouvee = Object.keys(CONFIG_SONDES_OFFICIELLES).find(
        (cle) => cle.toLowerCase().trim() === nomBrut.toLowerCase()   
    );

    // Si on trouve la clé, on prend son nomAffichage, sinon on garde le nomBrut
    const nomSonde = cleTrouvee ? (CONFIG_SONDES_OFFICIELLES[cleTrouvee]?.nomAffichage || nomBrut) : nomBrut;

      // Gestion universelle de la clé de l'eau (eau, hauteurEau, hauteur_eau)
      let brute = null;
      if (parametre === 'eau' || parametre === 'hauteurEau' || parametre === 'hauteur_eau') {
        brute = point.hauteurEau ?? point.hauteur_eau ?? point.eau;
      } else {
        brute = point[parametre];
      }
      
      // Conversion en nombre clean
      const valeurNum = brute !== undefined && brute !== null && brute !== '--' && brute !== '' ? Number(brute) : null;
      const timestampGroup = dateObj.getTime();

      // On n'ajoute le point que s'il y a une vraie valeur numérique exploitable
      if (valeurNum !== null && !isNaN(valeurNum)) {
        if (!groupes[timestampGroup]) {
          groupes[timestampGroup] = { timestamp: timestampGroup, heureStr: axeXStr };
        }
        groupes[timestampGroup][nomSonde] = valeurNum;
      }
    });

    return Object.values(groupes).sort((a, b) => a.timestamp - b.timestamp);
  };

  const donneesFormatees = pivoterDonnees();

  // 3. Rendu d'attente si aucune ligne exploitable n'est extraite
  if (donneesFormatees.length === 0) {
    return (
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 text-center text-slate-500 text-xs font-mono flex flex-col items-center justify-center gap-2">
        <AlertCircle size={20} className="text-slate-600" />
        <span>Aucun point d'historique trouvé pour "{label}".</span>
        <span className="text-[10px] text-slate-600">En attente de nouvelles trames LoRaWAN...</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/40 pb-4">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Calendar size={16} className="text-indigo-400" /> Comparatif — {label} {unite && `(${unite})`}
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">Superposition des courbes d'historique</p>
        </div>
        
        {listeCuves.length > 1 && (
          <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
            <Filter size={13} className="text-slate-400" />
            <select value={cuveSelectionnee} onChange={(e) => setCuveSelectionnee(e.target.value)} className="bg-transparent text-white focus:outline-none cursor-pointer text-[11px]">
              <option value="toutes" className="bg-slate-900">📦 Toutes les zones</option>
              {listeCuves.map((nom) => <option key={nom} value={nom} className="bg-slate-900">🪣 {nom}</option>)}
            </select>
          </div>
        )}
      </div>

      <div className="h-64 w-full bg-slate-950/40 rounded-2xl p-3 border border-slate-800/50">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={donneesFormatees}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.2} />
            <XAxis dataKey="heureStr" stroke="#475569" fontSize={9} tickLine={false} />
            <YAxis stroke="#475569" fontSize={9} tickLine={false} domain={domaine} />
            <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '12px', fontSize: '11px' }} />
            <Legend verticalAlign="top" height={32} wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
            
            {listeCuves.map((nomCuve, index) => {
              if (cuveSelectionnee !== 'toutes' && cuveSelectionnee !== nomCuve) return null;
              return (
                <Line
                  key={nomCuve}
                  name={nomCuve}
                  type="monotone"
                  dataKey={nomCuve}
                  stroke={COULEURS_SERRE[index % COULEURS_SERRE.length]}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}