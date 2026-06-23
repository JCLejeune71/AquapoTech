# AquapoTech IoT 🛰️🌱

**AquapoTech IoT** (anciennement *AquapoTech Surveillance*) est une solution open-source de supervision et de monitoring en temps réel pour systèmes aquaponiques. 

Ce projet est né d'un constat terrain : en milieu agricole ou horticole (serres, bassins extérieurs), les architectures Wi-Fi classiques montrent rapidement leurs limites (portée insuffisante, sensibilité aux obstacles, consommation électrique élevée). Pour pallier ces contraintes, **AquapoTech IoT** s'appuie sur la technologie **LoRa/LoRaWAN**, offrant une portée de plusieurs kilomètres et une efficacité énergétique maximale pour les capteurs sur batterie.

---

## 🚀 Avantages de l'Architecture

* **Zéro Problème de Portée (LoRa) :** Les distances entre la serre, les bassins et la station de contrôle ne sont plus un obstacle. Le signal traverse facilement les structures.
* **Ultra-Faible Consommation :** Les capteurs sont conçus pour fonctionner de longs mois (voire années) sur une simple batterie, sans intervention humaine fréquente.
* **Souveraineté & Low-Cost (Raspberry Pi 3) :** Le cœur du système (Gateway et serveur local) tourne sur un **Raspberry Pi 3**. Ce choix permet de minimiser drastiquement les coûts de matériel et la consommation électrique globale de la station centrale, tout en recyclant du matériel accessible.

---

## 📊 Métriques Monitorées

Le système acquiert, traite et centralise actuellement les données critiques suivantes :

* **Indicateurs Biologiques & Physico-chimiques :**
    * 🌡️ **Température** (Eau et Air)
    * 💨 **Taux d'oxygène dissous (O₂)** – *Critique pour la survie des poissons*
    * 🧪 **Potentiel Hydrogène (pH)** & **Électroconductivité (EC)** – *Pour l'équilibre des nutriments*
* **Gestion Hydrique & Environnement :**
    * 💧 **Niveau d'eau** (Détection des fuites / Évaporation)
    * ☁️ **Humidité ambiante**
* **Maintenance :**
    * 🔋 **État de la batterie** de chaque nœud capteur autonome.

---

## 💻 Interface Utilisateur (Dashboard React)

L'application web propose une interface moderne, légère et responsive (adaptée aux écrans fixes comme aux terminaux mobiles/legacy) articulée autour de 3 piliers :

1.  **Le Dashboard global :** Un écran de synthèse offrant un aperçu visuel immédiat et des jauges en temps réel de l'état de santé général du système.
2.  **Vue par Catégories :** Un système d'onglets regroupant les capteurs par typologie (ex: tous les capteurs thermiques, toutes les sondes pH) afin de faciliter l'analyse comparative et le suivi.
3.  **Système d'Alertes :** Notification instantanée dès qu'une métrique franchit un seuil critique (ex: chute de l'oxygène, pH anormal), permettant une intervention humaine rapide avant tout impact sur le vivant.

---

## 🛠️ Stack Technique

* **Hardware (Nœuds) :** Capteurs environnementaux + Microcontrôleurs compatibles LoRa.
* **Hardware (Passerelle & Serveur) :** Raspberry Pi 3 + Gateway LoRa.
* **Frontend :** React.js (Composants légers, rendus optimisés).
* **Réseau / Protocole :** LoRaWAN.

---

## 📈 Évolution du Projet (Pivot)

Initialement développé pour une exploitation propre, le projet logiciel et matériel **AquapoTech IoT** a été partagé, déployé et validé en conditions réelles en partenariat avec une ferme aquaponique active. Ce déploiement fait office de preuve de concept (PoC) et valide la résilience de l'architecture LoRaWAN en environnement agricole humide.