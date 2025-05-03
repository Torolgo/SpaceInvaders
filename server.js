const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080;

// Servir les fichiers statiques depuis le dossier 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Route principale qui renvoie le jeu
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur Space Invaders démarré sur le port ${PORT}`);
    console.log(`Accédez au jeu sur http://localhost:${PORT}`);
});