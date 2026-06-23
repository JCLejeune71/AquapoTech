import React, { useState } from 'react';
import { Settings, Plus } from 'lucide-react';

export default function Sidebar({ 
  seuilPoisson, 
  setSeuilPoisson, 
  deviceList, 
  supprimerSonde, 
  setDevices 
}) {
  const [nouvelleSondeNom, setNouvelleSondeNom] = useState('');
  const [hauteurMax, setHauteurMax] = useState(100);
  const [hauteurAlerteBasse, setHauteurAlerteBasse] = useState(20);

  const ajouterSondeManuelle = (e) => {
    e.preventDefault();
    if (!nouvelleSondeNom.trim()) return;

    const heure = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    setDevices((prev) => ({
      ...prev,
      [nouvelleSondeNom]: {
        nom: nouvelleSondeNom,
        temperature: (19 + Math.random() * 5).toFixed(1),
        humidite: (55 + Math.random() * 20).toFixed(1),
        ph: (6.2 + Math.random() * 1).toFixed(1),
        hauteurEau: (Number(hauteurAlerteBasse) + 15).toFixed(0), // Valeur initiale sécurisée au-dessus du seuil bas
        batterie: '100',
        rssi: '-45',
        date: heure,
        // On stocke la configuration personnalisée directement dans l'état de la sonde
        configPerso: {
          hauteurMax: Number(hauteurMax),
          hauteurAlerteBasse: Number(hauteurAlerteBasse)
        }
      }
    }));

    // Réinitialisation du formulaire
    setNouvelleSondeNom('');
    setHauteurMax(100);
    setHauteurAlerteBasse(20);
  };

  return (
    <div className="space-y-6 md:col-span-1">
      
      {/* SECTION SEUIL DE STRESS POISSONS */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 backdrop-blur-sm">
        <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-2">
          <Settings size={16} className="text-indigo-400" /> Configuration
        </h3>
        <div className="space-y-2">
          <label className="text-xs text-slate-400 flex justify-between font-mono">
            <span>Seuil Poissons :</span>
            <span className="text-red-400 font-bold">{seuilPoisson} °C</span>
          </label>
          <input 
            type="range" min="15" max="30" step="0.5" value={seuilPoisson} 
            onChange={(e) => setSeuilPoisson(Number(e.target.value))}
            className="w-full accent-indigo-500 bg-slate-950 rounded-lg appearance-none h-2 cursor-pointer"
          />
          <div className="text-[10px] text-slate-500 space-y-1 pt-1 border-t border-slate-800/60">
            <p>💡 <span className="text-amber-400 font-semibold">Seuils pH Fixes :</span></p>
            <p>Alerte si pH inférieur à 6.0 ou supérieur à 7.5.</p>
          </div>
        </div>
      </div>

      {/* SECTION NOUVELLE SONDE + PARAMÈTRES INDIVIDUELS */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 backdrop-blur-sm">
        <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-2">
          <Plus size={16} className="text-emerald-400" /> Ajouter un point
        </h3>
        <form onSubmit={ajouterSondeManuelle} className="space-y-3">
          <div>
            <label className="text-[10px] text-slate-400 font-mono block mb-1">Nom du point / cuve :</label>
            <input 
              type="text" placeholder="Ex: Bassin Truites..." value={nouvelleSondeNom}
              onChange={(e) => setNouvelleSondeNom(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 font-mono block mb-1">Hauteur Max (cm) :</label>
              <input 
                type="number" min="10" max="300" value={hauteurMax}
                onChange={(e) => setHauteurMax(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-mono block mb-1">Alerte Basse (cm) :</label>
              <input 
                type="number" min="0" max="300" value={hauteurAlerteBasse}
                onChange={(e) => setHauteurAlerteBasse(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs py-2 rounded-xl transition-colors flex items-center justify-center gap-2 pt-2">
            <Plus size={14} /> Enregistrer la zone
          </button>
        </form>

        {/* LISTE POUR NETTOYAGE */}
        {deviceList.length > 0 && (
          <div className="pt-3 border-t border-slate-800/60 space-y-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Zones configurées :</p>
            <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
              {deviceList.map(d => (
                <div key={d.nom} className="flex justify-between items-center bg-slate-950/40 p-2 rounded-lg border border-slate-800/40 text-xs">
                  <span className="truncate max-w-[120px] font-mono">{d.nom}</span>
                  <button onClick={() => supprimerSonde(d.nom)} className="text-[10px] text-red-400 hover:text-red-300 font-medium">Supprimer</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}