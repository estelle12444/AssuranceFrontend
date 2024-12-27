# Guide pour les Captures d'Écran

## Comment Prendre des Captures d'Écran

1. **Pour Windows** :
   - Utilisez `Windows + Shift + S` pour l'outil de capture
   - Ou utilisez l'outil "Capture d'écran" de Windows
   - Sauvegardez en format PNG

2. **Pour les Captures d'Écran Mobile** :
   - Utilisez les outils de développement du navigateur (F12)
   - Activez le mode responsive
   - Sélectionnez différentes tailles d'écran

## Organisation des Images

Les captures d'écran doivent être placées dans le dossier `docs/images/` avec la structure suivante :
```
docs/
└── images/
    ├── home.png              # Page d'accueil
    ├── simulation.png        # Page de simulation
    ├── subscription-step1.png # Étape 1 de la souscription
    ├── subscription-step2.png # Étape 2 de la souscription
    ├── subscription-step3.png # Étape 3 de la souscription
    └── mobile-view.png       # Vue mobile
```

## Directives pour les Captures d'Écran

1. **Résolution** :
   - Desktop : 1920x1080 minimum
   - Mobile : 375x812 (iPhone X) recommandé

2. **Format** :
   - Utiliser le format PNG pour une meilleure qualité
   - Taille maximale recommandée : 500 KB par image

3. **Contenu** :
   - Capturer l'interface avec des données d'exemple réalistes
   - Éviter d'inclure des informations sensibles
   - S'assurer que tous les éléments sont visibles

4. **Mise à Jour** :
   - Mettre à jour les captures d'écran après des changements majeurs de l'interface
   - Maintenir la cohérence entre les images
   - Dater les captures d'écran dans le nom du fichier si nécessaire

## Comment Ajouter de Nouvelles Captures d'Écran

1. Prendre la capture d'écran selon les directives ci-dessus
2. Redimensionner si nécessaire (maintenir les proportions)
3. Sauvegarder dans le dossier `docs/images/`
4. Mettre à jour le README.md avec le nouveau lien
5. Commiter les changements :
   ```bash
   git add docs/images/nouvelle-capture.png
   git commit -m "Ajout capture d'écran : description"
   ``` 