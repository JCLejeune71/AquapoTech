// src/config/sondesConfig.js

export const CONFIG_SONDES_OFFICIELLES = {
  "Sonde Serre Nord": {
    nomAffichage: "Sonde Serre Nord", // Le nom propre qui apparaîtra à gauche
    metriquesAutorisees: ["temperature", "hauteur_eau", "oxygene"] // Uniquement pour les poissons
  },
  "Sonde 2 Serre Test": {
    nomAffichage: "Sonde 2 Serre Test", 
    metriquesAutorisees: ["temperature", "humidite"] // Pas de pH ni d'O2 ici !
  },
  "Sonde Filtre Biologique": {
    nomAffichage: "Filtre Biologique N°1",
    metriquesAutorisees: ["temperature", "ph", "ec"] // Spécifique au traitement de l'eau
  }
};

export const CONFIG_PAR_DEFAUT = {
  nomAffichage: null, // Si null, on gardera le nom brut de la BDD
  hauteurMax: 100,
  hauteurAlerteBasse: 20
};