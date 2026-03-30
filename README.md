# 🐦 Radar ornithologique – application mobile

## 📱 Description

Application Android permettant de suggérer les espèces d’oiseaux probables en fonction de la position GPS, de l’occupation des sols, de l’altitude et de la saison.

Projet personnel orienté naturalisme et développement mobile.

---

## 🌍 Fonctionnement

1. Récupération de la position GPS
2. Interrogation d’un proxy Node.js
3. Lecture d’un raster WorldCover (ESA)
4. Détection du type de milieu
5. Suggestion d’espèces probables

---

## 🧠 Technologies utilisées

* React Native (Expo)
* Node.js / Express
* GeoTIFF (WorldCover ESA)
* API REST (JSON)

---

## 🗺️ Architecture

Mobile → API proxy → Raster satellite → Classe sol → Habitat → Espèces

---

## ⚠️ État du projet

* Proxy local (pas encore déployé)
* Base espèces en cours de construction
* Fonctionne en environnement de développement

---

## 🚀 Objectifs

* Ajouter altitude
* Ajouter saison
* Améliorer la précision habitat (buffer multi-pixels)
* Intégrer base espèces Haute-Loire

---

## 👤 Auteur

Projet personnel – en apprentissage développement web/mobile
