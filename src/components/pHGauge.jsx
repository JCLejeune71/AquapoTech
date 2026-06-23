import React from 'react';
import GaugeComponent from "react-gauge-component";

export default function PhGauge({ value }) {
  const phValue = value !== "--" && !isNaN(Number(value)) ? Number(value) : 7;

  return (
    <div className="w-full max-w-[260px] -mb-6 mt-1 scale-105 origin-bottom">
      <GaugeComponent
        type="semicircle"
        arc={{
          width: 0.2,
          padding: 0.005,
          cornerRadius: 1,
          gradient: true,
          subArcs: [
            { limit: 5.5, color: '#EA4228', showTick: true }, // Trop acide
            { limit: 6.5, color: '#F5CD19', showTick: true }, // Limite basse
            { limit: 7.5, color: '#5BE12C', showTick: true }, // Optimal Aquaponie / Maraîchage
            { limit: 8.0, color: '#F5CD19', showTick: true }, // Limite haute
            { limit: 9.5, color: '#EA4228', showTick: true }   // Trop basique
          ]
        }}
        pointer={{
          color: '#94a3b8', // Couleur gris-bleu de l'aiguille
          length: 0.75,     // Longueur de l'aiguille
          width: 12,        // ÉPAISSEUR : Augmentée de 3 à 12 pour être bien visible
          elastic: true     // Effet de rebond à la mise à jour
        }}
        labels={{
          valueLabel: {
            formatTextValue: (val) => val + ' pH',
            style: {
              fontSize: '24px',
              fontWeight: '900',
              fill: '#ffffff',
              fontFamily: 'monospace',
              textAnchor: 'middle'
            }
          },
          tickLabels: {
            type: 'inner',
            defaultTickValueConfig: {
              formatTextValue: (val) => val,
              style: { fontSize: '10px', fill: '#64748b' }
            }
          }
        }}
        value={phValue}
        minValue={5}
        maxValue={9}
      />
    </div>
  );
}