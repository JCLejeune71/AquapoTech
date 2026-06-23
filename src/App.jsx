import React, { useEffect, useState } from 'react';
import { RefreshCw, Thermometer, Droplets, Activity, Waves, AlertTriangle, Calendar, Eye, Zap } from 'lucide-react';
import OxygenChart from './components/OxygenChart'; 
import EcChart from './components/EcChart';         
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SondeCard from './components/SondeCard';
import HistoryChart from './components/HistoryChart';
import GenericParamChart from './components/GenericParamChart';
import { CONFIG_SONDES_OFFICIELLES, CONFIG_PAR_DEFAUT } from "./config/sondesConfig";

function App() {
  const [devices, setDevices] = useState(() => {
    const sauvegarde = localStorage.getItem('lora_dashboard_devices');
    return sauvegarde ? JSON.parse(sauvegarde) : {};
  });

  const [seuilPoisson, setSeuilPoisson] = useState(() => {
    const sauvegardeSeuil = localStorage.getItem('lora_dashboard_seuil');
    return sauvegardeSeuil ? Number(sauvegardeSeuil) : 22;
  });

  const [status, setStatus] = useState('Connexion...');
  const [historique, setHistorique] = useState([]);
  const [activeTab, setActiveTab] = useState('tous');

  useEffect(() => {
    localStorage.setItem('lora_dashboard_devices', JSON.stringify(devices));
  }, [devices]);

  useEffect(() => {
    localStorage.setItem('lora_dashboard_seuil', seuilPoisson.toString());
  }, [seuilPoisson]);

  const chargerHistorique = () => {
    fetch('http://192.168.188.114:1880/api/mesures')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Alignement strict avec les colonnes de votre base PostgreSQL
          const normalise = data.map(point => ({
            ...point,
            nom: point.nom_sonde || point.nom || "Zone Inconnue",
            date_mesure: point.date_heure || point.date_mesure, // Correction critique de la clé de date
            temperature: point.temperature ?? point.temp,
            humidite: point.humidite ?? point.humidity,
            ph: point.ph,
            hauteurEau: point.hauteur_eau ?? point.hauteurEau, // Correction critique de l'underscore
            oxygene: point.oxygene ?? point.oxygen,
            ec: point.ec
          }));
          setHistorique(normalise);
        }
      })
      .catch(error => console.error("Erreur historique API:", error));
  };

  useEffect(() => {
    chargerHistorique();
    const intervalHist = setInterval(chargerHistorique, 30000);
    const ws = new WebSocket('ws://192.168.188.114:1880/ws/sensors');

    ws.onopen = () => setStatus('Connecté au Pi');
    ws.onclose = () => setStatus('Déconnecté');
    ws.onerror = () => setStatus('Erreur de liaison');

    ws.onmessage = (event) => {
      try {
        const trame = JSON.parse(event.data);
        if (!trame || !trame.deviceInfo) return;

        const nomCapteur = trame.deviceInfo.deviceName || "Zone Inconnue";
        const mesures = trame.object || {}; 
        const heure = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        setDevices((prev) => {
          const ancienneSonde = prev[nomCapteur] || {};
          return {
            ...prev,
            [nomCapteur]: {
              nom: nomCapteur,
              temperature: mesures.temperature ?? ancienneSonde.temperature ?? '--',
              humidite: mesures.humidity ?? mesures.humidite ?? ancienneSonde.humidite ?? '--',
              ph: mesures.ph ?? ancienneSonde.ph ?? '--',
              hauteurEau: mesures.hauteurEau ?? mesures.hauteur_eau ?? ancienneSonde.hauteurEau ?? '--',
              oxygene: mesures.oxygene ?? mesures.oxygen ?? mesures.o2 ?? ancienneSonde.oxygene ?? '--',
              ec: mesures.ec ?? mesures.conductivity ?? mesures.conductivite ?? ancienneSonde.ec ?? '--',
              batterie: mesures.battery ?? mesures.batterie ?? '--',
              rssi: trame.rxInfo?.[0]?.rssi ?? ancienneSonde.rssi ?? '--',
              date: heure,
              configPerso: ancienneSonde.configPerso
            }
          };
        });
      } catch (error) {
        console.error("Erreur critique décodage WebSocket:", error);
      }
    };

    return () => {
      clearInterval(intervalHist);
      ws.close();
    };
  }, []);

  const supprimerSonde = (nom) => {
    setDevices((prev) => {
      const copie = { ...prev };
      delete copie[nom];
      return copie;
    });
  };

  const deviceList = Object.values(devices);

  const totalAlertes = deviceList.reduce((acc, dev) => {
    const configSonde = dev.configPerso || CONFIG_SONDES_OFFICIELLES[dev.nom] || CONFIG_PAR_DEFAUT;
    const t = Number(dev.temperature);
    const p = Number(dev.ph);
    const e = Number(dev.hauteurEau);

    const aTemp = !isNaN(t) && t > seuilPoisson;
    const aPh = !isNaN(p) && (p < 6.0 || p > 7.5);
    const aEau = dev.hauteurEau !== "--" && !isNaN(e) && e < configSonde.hauteurAlerteBasse;

    return acc + (aTemp ? 1 : 0) + (aPh ? 1 : 0) + (aEau ? 1 : 0);
  }, 0);

  const tabs = [
    { id: 'tous', label: 'Vue d\'ensemble', icon: <Activity size={16} /> },
    { id: 'temperature', label: 'Températures', icon: <Thermometer size={16} /> },
    { id: 'humidite', label: 'Humidités', icon: <Droplets size={16} /> },
    { id: 'ph', label: 'Analyses pH', icon: <Activity size={16} /> },
    { id: 'eau', label: 'Niveaux d\'eau', icon: <Waves size={16} /> },
    { id: 'oxygene', label: 'Oxygène O₂', icon: <Eye size={16} className="text-pink-400" /> }, 
    { id: 'ec', label: 'Conductivité EC', icon: <Zap size={16} className="text-purple-400" /> },    
    { id: 'historique', label: 'Historique Global', icon: <Calendar size={16} /> },
    { id: 'alertes', label: `Alertes ${totalAlertes > 0 ? `(${totalAlertes})` : ''}`, icon: <AlertTriangle size={16} className={totalAlertes > 0 ? 'text-red-400 animate-bounce' : ''} /> },
  ];

  return (
    <div className="min-h-screen bg-[#0b1329] text-slate-100 font-sans antialiased flex flex-col">
      <Header status={status} />

      <div className="max-w-[1600px] w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 flex-1">
        <div className="w-full lg:w-80 shrink-0">
          <Sidebar seuilPoisson={seuilPoisson} setSeuilPoisson={setSeuilPoisson} deviceList={deviceList} supprimerSonde={supprimerSonde} setDevices={setDevices} />
        </div>

        <div className="flex-1 space-y-6 min-w-0">
          <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-none snap-x px-1 lg:flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 whitespace-nowrap snap-start ${
                  activeTab === tab.id
                    ? activeTab === 'alertes' && totalAlertes > 0 ? 'bg-red-600 text-white shadow-lg' : 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 border border-slate-800/80'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-8">
            {activeTab === 'alertes' && totalAlertes === 0 ? (
              <div className="flex flex-col items-center justify-center border border-emerald-950 rounded-3xl p-12 text-center bg-emerald-950/5">
                <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-full mb-3">✔️</div>
                <h3 className="text-lg font-bold text-white">Aucune anomalie détectée</h3>
              </div>
            ) : activeTab === 'historique' ? (
              <HistoryChart historique={historique} />
            ) : (
              <div className="space-y-8">
                {deviceList.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {deviceList.map((sonde) => (
                      <SondeCard key={sonde.nom} sonde={sonde} viewMode={activeTab} seuilPoisson={seuilPoisson} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center border border-slate-800 rounded-3xl p-16 text-center bg-slate-900/20">
                    <RefreshCw className="text-indigo-400 animate-spin mb-4" size={32} />
                    <h3 className="text-xl font-bold text-white">En attente de données...</h3>
                  </div>
                )}

                {/* GRAPHIC COMPARATIF CONTEXTUEL AUTOMATIQUE */}
                <div className="pt-4 border-t border-slate-800/60">
                  <GenericParamChart 
                    historique={historique} 
                    parametre={activeTab} 
                    label={tabs.find(t => t.id === activeTab)?.label || ""} 
                    domaine={activeTab === 'ph' ? [6.0, 8.0] : activeTab === 'temperature' ? [15, 26] : [0, 'auto']} 
                    unite={activeTab === 'temperature' ? '°C' : activeTab === 'humidite' ? '%' : activeTab === 'eau' ? 'cm' : activeTab === 'oxygene' ? 'mg/L' : activeTab === 'ec' ? 'mS/cm' : ''} 
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;