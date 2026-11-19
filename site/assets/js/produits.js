/* =========================================================
   CATALOGUE DE LA BOUTIQUE LA GAZELLE
   ---------------------------------------------------------
   Pour modifier la boutique, il suffit de modifier cette liste.

   Chaque produit :
     id          identifiant unique, sans espace ni accent (ex. "cle-molette-250")
     nom         nom affiché
     categorie   une des clés de CATEGORIES ci-dessous
     description courte description (1 à 2 lignes)
     unite       ex. "la pièce", "la barre de 4 m", "le lot de 10"
     prix        prix en FCFA (nombre, ex. 7500) ou null pour « Prix sur demande »
     image       chemin d'une photo (ex. "assets/img/produits/cle-molette.jpg") ou null
     badge       petit texte mis en avant (ex. "Pro", "Nouveau") ou null

   Les articles ci-dessous sont des EXEMPLES à remplacer par les vrais
   produits, photos et prix de La Gazelle.
   ========================================================= */

window.CATEGORIES = {
  outillage:    { nom: "Outillage",              icone: "i-tools" },
  tubes:        { nom: "Tubes & raccords",       icone: "i-pipe" },
  robinetterie: { nom: "Robinetterie",           icone: "i-tap" },
  sanitaires:   { nom: "Sanitaires",             icone: "i-toilet" },
  etancheite:   { nom: "Étanchéité & colles",    icone: "i-drop" },
  pompes:       { nom: "Pompes & stockage",      icone: "i-pump" }
};

window.PRODUITS = [
  /* ---- Outillage ---- */
  { id: "cle-molette", nom: "Clé à molette", categorie: "outillage",
    description: "Clé réglable pour écrous et raccords, en acier chromé.", unite: "la pièce", prix: null, image: null, badge: null },
  { id: "cle-serre-tube", nom: "Clé serre-tube", categorie: "outillage",
    description: "Pour serrer et desserrer les tubes et raccords filetés.", unite: "la pièce", prix: null, image: null, badge: "Pro" },
  { id: "pince-multiprise", nom: "Pince multiprise", categorie: "outillage",
    description: "Pince réglable pour siphons, écrous et raccords.", unite: "la pièce", prix: null, image: null, badge: null },
  { id: "coupe-tube", nom: "Coupe-tube", categorie: "outillage",
    description: "Coupe nette des tubes PPR, PER et multicouche.", unite: "la pièce", prix: null, image: null, badge: null },
  { id: "scie-metaux", nom: "Scie à métaux", categorie: "outillage",
    description: "Pour couper tubes PVC, acier et tiges filetées.", unite: "la pièce", prix: null, image: null, badge: null },
  { id: "poste-soudure-ppr", nom: "Poste à souder PPR", categorie: "outillage",
    description: "Machine de thermofusion pour tubes PPR, avec embouts.", unite: "le kit", prix: null, image: null, badge: "Pro" },
  { id: "deboucheur", nom: "Furet déboucheur", categorie: "outillage",
    description: "Câble pour déboucher éviers, douches et canalisations.", unite: "la pièce", prix: null, image: null, badge: null },

  /* ---- Tubes & raccords ---- */
  { id: "tube-pvc-evacuation", nom: "Tube PVC évacuation", categorie: "tubes",
    description: "Pour eaux usées et eaux vannes. Plusieurs diamètres.", unite: "la barre", prix: null, image: null, badge: null },
  { id: "tube-ppr", nom: "Tube PPR eau chaude / froide", categorie: "tubes",
    description: "Tube d'alimentation à souder. Plusieurs diamètres.", unite: "la barre", prix: null, image: null, badge: null },
  { id: "raccords-pvc", nom: "Raccords PVC (coudes, tés, manchons)", categorie: "tubes",
    description: "Raccords pour réseaux d'évacuation, tous diamètres.", unite: "la pièce", prix: null, image: null, badge: null },
  { id: "raccords-ppr", nom: "Raccords PPR", categorie: "tubes",
    description: "Coudes, tés, manchons et raccords filetés à souder.", unite: "la pièce", prix: null, image: null, badge: null },
  { id: "vanne-arret", nom: "Vanne d'arrêt", categorie: "tubes",
    description: "Vanne quart de tour pour couper l'eau par secteur.", unite: "la pièce", prix: null, image: null, badge: null },

  /* ---- Robinetterie ---- */
  { id: "mitigeur-lavabo", nom: "Mitigeur de lavabo", categorie: "robinetterie",
    description: "Mitigeur monotrou, finition chromée.", unite: "la pièce", prix: null, image: null, badge: null },
  { id: "robinet-cuisine", nom: "Robinet d'évier de cuisine", categorie: "robinetterie",
    description: "Bec haut orientable pour évier.", unite: "la pièce", prix: null, image: null, badge: null },
  { id: "colonne-douche", nom: "Colonne de douche", categorie: "robinetterie",
    description: "Pomme de tête, douchette et mitigeur.", unite: "le kit", prix: null, image: null, badge: null },
  { id: "robinet-puisage", nom: "Robinet de puisage", categorie: "robinetterie",
    description: "Robinet extérieur pour jardin, cour ou lavage.", unite: "la pièce", prix: null, image: null, badge: null },

  /* ---- Sanitaires ---- */
  { id: "wc-complet", nom: "WC complet avec réservoir", categorie: "sanitaires",
    description: "Cuvette, réservoir, mécanisme et abattant.", unite: "l'ensemble", prix: null, image: null, badge: null },
  { id: "lavabo", nom: "Lavabo", categorie: "sanitaires",
    description: "Lavabo en céramique, sur colonne ou à poser.", unite: "la pièce", prix: null, image: null, badge: null },
  { id: "mecanisme-chasse", nom: "Mécanisme de chasse d'eau", categorie: "sanitaires",
    description: "Kit de remplacement : flotteur et mécanisme.", unite: "le kit", prix: null, image: null, badge: null },
  { id: "siphon", nom: "Siphon de lavabo ou d'évier", categorie: "sanitaires",
    description: "Siphon PVC avec bonde.", unite: "la pièce", prix: null, image: null, badge: null },

  /* ---- Étanchéité & colles ---- */
  { id: "teflon", nom: "Ruban téflon", categorie: "etancheite",
    description: "Étanchéité des raccords filetés.", unite: "le rouleau", prix: null, image: null, badge: null },
  { id: "colle-pvc", nom: "Colle PVC", categorie: "etancheite",
    description: "Collage des tubes et raccords PVC.", unite: "le pot", prix: null, image: null, badge: null },
  { id: "silicone-sanitaire", nom: "Silicone sanitaire", categorie: "etancheite",
    description: "Joints de baignoire, douche, lavabo. Anti-moisissure.", unite: "la cartouche", prix: null, image: null, badge: null },
  { id: "filasse-pate", nom: "Filasse et pâte à joint", categorie: "etancheite",
    description: "Étanchéité traditionnelle des raccords.", unite: "le lot", prix: null, image: null, badge: null },

  /* ---- Pompes & stockage ---- */
  { id: "pompe-surface", nom: "Pompe de surface", categorie: "pompes",
    description: "Pour puits, citerne ou bâche à eau.", unite: "la pièce", prix: null, image: null, badge: null },
  { id: "surpresseur", nom: "Surpresseur", categorie: "pompes",
    description: "Augmente la pression d'eau dans la maison.", unite: "la pièce", prix: null, image: null, badge: "Pro" },
  { id: "cuve-eau", nom: "Cuve de stockage d'eau", categorie: "pompes",
    description: "Réservoir en polyéthylène, plusieurs capacités.", unite: "la pièce", prix: null, image: null, badge: null }
];
