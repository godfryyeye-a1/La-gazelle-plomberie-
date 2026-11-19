# La Gazelle Plomberie – Service Sanitaire

Site web et identité visuelle de **La Gazelle Plomberie**, fondée par **M. Achille Yeye** à Cotonou, au Bénin. L'entreprise intervient en Afrique et en Europe et elle est disponible 24h/24.

## Contenu du dépôt

| Dossier | Contenu |
|---|---|
| `brand/` | Logo et affiches originaux (identité visuelle de référence) |
| `site/` | Le site web : HTML, CSS et JavaScript, sans dépendance à installer |
| `.github/workflows/pages.yml` | Mise en ligne automatique sur GitHub Pages |

## Plan du site (feuille de route)

| Étape | Contenu | État |
|---|---|---|
| 1 | Page d'accueil : présentation, fondateur, parcours, réalisations, les 3 espaces | ✅ Faite |
| 2 | Commander un service ou un chantier : formulaire particulier / entreprise | ✅ Fait |
| 3 | Boutique d'outils de plomberie | ✅ Faite, catalogue d'exemple à remplacer |
| 4 | Formations de La Gazelle Académie et inscription en ligne | ⏳ Page d'attente (WhatsApp) |
| 5 | Mise en ligne : nom de domaine, fiche Google, réseaux sociaux, QR codes | À venir |
| 6 | Paiement en ligne, suivi des commandes, version anglaise | À venir |

## Voir le site sur son ordinateur

```bash
cd site
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Mettre le site en ligne (gratuit)

1. Fusionner la branche dans `main`.
2. Sur GitHub, aller dans **Settings → Pages → Source** et choisir **GitHub Actions**.
3. Le site est publié automatiquement à chaque mise à jour de `main`.

## Formulaire de commande (`commander.html`)

- 3 étapes : le besoin, le chantier, les coordonnées. Des champs supplémentaires s'affichent pour les entreprises.
- À la validation, le site prépare un message structuré avec une référence (`LGP-AAMMJJ-XXXX`). Le client l'envoie ensuite sur WhatsApp, par SMS, ou partage ses photos avec le message.
- Aucune donnée n'est stockée sur un serveur. Seul un brouillon est gardé sur le téléphone du client tant que la demande n'est pas validée.
- Liens pré-remplis, utiles pour les QR codes :
  - `commander.html?service=urgence`
  - `commander.html?client=entreprise&service=chantier`
  - services possibles : `urgence`, `installation`, `equipements`, `renovation`, `chantier`, `maintenance`, `etude`, `autre`.

## Boutique (`boutique.html`)

- Catalogue avec catégories, recherche et panier. Le panier est gardé sur le téléphone du client. La commande part sur WhatsApp avec une référence `LGB-AAMMJJ-XXXX`.
- **Les produits se modifient dans un seul fichier : `site/assets/js/produits.js`**. Pour chaque article :
  - nom, catégorie et description ;
  - unité (la pièce, la barre…) ;
  - prix en FCFA, ou `null` pour afficher « Prix sur demande » ;
  - photo : à placer dans `site/assets/img/produits/`.
- Les articles actuels sont des **exemples** à remplacer par les vrais produits, photos et prix de La Gazelle.
- Lien direct vers une catégorie : `boutique.html?categorie=robinetterie`. Catégories possibles : `outillage`, `tubes`, `robinetterie`, `sanitaires`, `etancheite`, `pompes`.

## Modifier les informations

- **Numéro de téléphone et WhatsApp** : `01 97 44 50 15`. Le numéro WhatsApp est défini dans `site/assets/js/main.js` (`WHATSAPP_NUMBER`). Les liens `tel:` se trouvent dans les fichiers HTML.
- **Parcours du fondateur** : section `#fondateur` de `site/index.html`. Pour ajouter les années, insérer `<span class="year">2010</span>` avant chaque titre `<h4>`.
- **Photos des réalisations** : remplacer les images dans `site/assets/img/` en gardant les mêmes noms, ou ajouter des blocs `<figure>` dans la section `#realisations`.
