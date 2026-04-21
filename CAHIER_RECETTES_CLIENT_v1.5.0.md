# Cahier de Recettes Client - CaFaith Normandie

Version cible: v1.5.0
Date: 21/04/2026
Produit: Application de gestion des ventes cafeteria

## 1. Objet
Ce document sert a valider fonctionnellement l'application avant presentation client et mise en production finale.

## 2. Perimetre de recette
- Authentification et controle d'acces
- Creation de vente
- Prise de commande (mode caisse)
- Paiement (dont paiement mixte)
- Cloture de vente
- Rapports PDF et Excel
- Deconnexion

Hors perimetre:
- Tests de charge
- Tests de penetration securite
- Automatisation E2E complete

## 3. Environnements
- Frontend (production): https://app-cafet.vercel.app
- Backend (production): https://app-cafet-api.onrender.com
- Base de donnees: PostgreSQL (Render)

## 4. Pre-requis
- Disposer d'au moins 1 vendeuse active
- Disposer d'au moins 1 plat, 1 boisson, 1 dessert
- Navigateur Chrome/Edge a jour
- Connexion internet stable

## 5. Regles de validation
- Critique: KO interdit (bloquant go-live)
- Majeur: max 1 KO tolere avec contournement documente
- Mineur: KO possible si sans impact demo client

Definition des statuts:
- OK: conforme au resultat attendu
- KO: non conforme
- NA: non applicable

## 6. Jeux de donnees proposes
- Vendeuse: Mistura / 0758297734
- Client test: Sarah
- Produits:
  - Plat: Poisson Attieke (7.50)
  - Boisson: Coca-Cola (2.50)
  - Dessert: Cookies (2.00)

## 7. Scenarios de recette

## 7.1 Authentification
| ID | Criticite | Scenario | Preconditions | Etapes | Resultat attendu | Resultat obtenu | Statut |
|---|---|---|---|---|---|---|---|
| AUTH-01 | Critique | Connexion valide | Utilisateur existant | 1) Ouvrir l'app 2) Saisir prenom + telephone valides 3) Se connecter | Acces a l'ecran principal de l'application |  |  |
| AUTH-02 | Critique | Connexion invalide | Aucun | 1) Saisir des identifiants invalides 2) Se connecter | Refus de connexion avec message d'erreur explicite |  |  |
| AUTH-03 | Critique | Route protegee sans session | Etre deconnecte | 1) Tenter l'URL d'un ecran prive (ex: create-sale) | Redirection automatique vers login |  |  |

## 7.2 Creation de vente
| ID | Criticite | Scenario | Preconditions | Etapes | Resultat attendu | Resultat obtenu | Statut |
|---|---|---|---|---|---|---|---|
| CRE-01 | Critique | Creation vente minimale | Etre connecte | 1) Aller sur creation vente 2) Choisir date 3) Choisir vendeuse 4) Selectionner au moins un produit 5) Creer la vente | Vente creee et navigation vers prise de commande |  |  |
| CRE-02 | Majeure | Compteurs intelligents | Etre sur creation vente | 1) Ne rien selectionner 2) Observer compteurs 3) Selectionner vendeuse + produits | Les compteurs refletent uniquement les selections effectives |  |  |
| CRE-03 | Majeure | Ajout vendeuse persistant | Etre sur creation vente | 1) Ajouter nouvelle vendeuse 2) Recharger page | La vendeuse apparait dans la liste apres rechargement |  |  |
| CRE-04 | Majeure | Ajout produit persistant | Etre sur creation vente | 1) Ajouter un nouveau plat/boisson/dessert 2) Recharger page | Les nouveaux produits sont conserves |  |  |

## 7.3 Prise de commande (mode caisse)
| ID | Criticite | Scenario | Preconditions | Etapes | Resultat attendu | Resultat obtenu | Statut |
|---|---|---|---|---|---|---|---|
| CMD-01 | Critique | Ajout/suppression quantites | Vente active | 1) Ajouter produits via + 2) Retirer via - | Quantites incrementees/decrementees sans valeur negative |  |  |
| CMD-02 | Majeure | Recherche rapide produits | Vente active | 1) Saisir texte dans recherche 2) Verifier cartes affichees | Filtrage instantane des produits par nom |  |  |
| CMD-03 | Majeure | Stats live commande | Vente active | 1) Ajouter/retirer des articles | Compteurs live (plats/boissons/desserts/total) a jour |  |  |
| CMD-04 | Mineure | Mode caisse plein ecran | Vente active | 1) Activer mode caisse 2) Desactiver | UI bascule en mode compact et reste exploitable |  |  |

## 7.4 Paiement
| ID | Criticite | Scenario | Preconditions | Etapes | Resultat attendu | Resultat obtenu | Statut |
|---|---|---|---|---|---|---|---|
| PAY-01 | Critique | Paiement simple equilibre | Panier non vide | 1) Choisir un moyen 2) Saisir montant exact 3) Valider commande | Commande validee avec succes |  |  |
| PAY-02 | Critique | Paiement mixte equilibre | Panier non vide | 1) Cocher 2 moyens 2) Repartir montants 3) Verifier total paiements = total commande 4) Valider | Validation acceptee en mode Mixte |  |  |
| PAY-03 | Critique | Paiement non equilibre | Panier non vide | 1) Saisir montants dont somme differente 2) Tenter validation | Validation refusee avec message explicite |  |  |

## 7.5 Cloture et rapports
| ID | Criticite | Scenario | Preconditions | Etapes | Resultat attendu | Resultat obtenu | Statut |
|---|---|---|---|---|---|---|---|
| CLS-01 | Critique | Generation rapport PDF | Vente avec commandes | 1) Aller ecran cloture 2) Cliquer Generer PDF | Fichier PDF telecharge, contenu coherent |  |  |
| CLS-02 | Critique | Generation rapport Excel mono-onglet | Vente avec commandes | 1) Cliquer Generer Excel | Fichier XLSX telecharge avec toutes sections dans un seul onglet |  |  |
| CLS-03 | Majeure | Bouton mail disponible | Ecran cloture ouvert | 1) Generer PDF/Excel 2) Cliquer Envoyer par mail | Bouton mail reste utilisable et ouvre le client mail |  |  |
| CLS-04 | Majeure | Coherence chiffres rapport | Vente avec commandes | 1) Comparer panier/commandes/rapports | Totaux, quantites et paiements conformes |  |  |

## 7.6 Deconnexion
| ID | Criticite | Scenario | Preconditions | Etapes | Resultat attendu | Resultat obtenu | Statut |
|---|---|---|---|---|---|---|---|
| SEC-01 | Critique | Deconnexion utilisateur | Etre connecte | 1) Cliquer Se deconnecter | Retour login + acces routes privees bloque |  |  |

## 8. Tableau de suivi des anomalies
| ID anomalie | Scenario lie | Priorite | Description | Reproductible | Statut | Correctif/Contournement |
|---|---|---|---|---|---|---|
| BUG-001 |  |  |  |  |  |  |
| BUG-002 |  |  |  |  |  |  |

## 9. PV de recette (validation finale)
- Date execution recette:
- Participants:
- Nombre total de tests executes:
- Nombre OK:
- Nombre KO:
- Nombre NA:
- Decision Go/No-Go:
- Risques residuels:
- Commentaires:

Signatures:
- Responsable metier/client:
- Responsable projet:
- Responsable technique:

## 10. Checklist pre-production
- [ ] Tous les scenarios critiques AUTH/PAY/CLS sont OK
- [ ] Aucun KO critique ouvert
- [ ] Rapports PDF et Excel verifies avec donnees reelles
- [ ] URL de production valides et accessibles
- [ ] Tag release valide (v1.5.0)
- [ ] Plan de rollback disponible
