const express = require('express');
const fs = require('fs').promises;
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());
app.use(express.static('.'));

// Charger les plats depuis le fichier JSON
let plats = [];
let menus = [];



async function loadData() {
    try {
        const platsData = await fs.readFile('./plats.json', 'utf8');
        plats = JSON.parse(platsData);
        
        const menusData = await fs.readFile('./menus.json', 'utf8');
        menus = JSON.parse(menusData);

        
    } catch (err) {
        console.error('Erreur lors de la lecture des fichiers JSON:', err);
    }
}

async function saveMenus() {
    try {
        await fs.writeFile('./menus.json', JSON.stringify(menus, null, 2));
    } catch (err) {
        console.error('Erreur lors de l\'écriture dans le fichier menus.json:', err);
    }
}

loadData();

// Routes existantes pour les plats
app.get('/api/plats', (req, res) => {
    res.json(plats);
});

app.post('/api/plats', async (req, res) => {
    const { nom, prix, categorie, disponibilite } = req.body;

    if (!nom || !prix || !categorie) {
        return res.status(400).json({ message: 'Les champs nom, prix et catégorie sont requis.' });
    }

    const newPlat = {
        id: plats.length > 0 ? plats[plats.length - 1].id + 1 : 1,
        nom,
        prix,
        categorie,
        disponibilite: disponibilite || false
    };

    plats.push(newPlat);
    await fs.writeFile('./plats.json', JSON.stringify(plats, null, 2));
    res.status(201).json(newPlat);
});

app.put('/api/plats/:id', async (req, res) => {
    const platId = parseInt(req.params.id);
    const platIndex = plats.findIndex(p => p.id === platId);

    if (platIndex === -1) {
        return res.status(404).json({ message: 'Plat non trouvé' });
    }

    const { nom, prix, categorie, disponibilite } = req.body;
    plats[platIndex] = {
        ...plats[platIndex],
        nom: nom || plats[platIndex].nom,
        prix: prix || plats[platIndex].prix,
        categorie: categorie || plats[platIndex].categorie,
        disponibilite: disponibilite !== undefined ? disponibilite : plats[platIndex].disponibilite
    };

    await fs.writeFile('./plats.json', JSON.stringify(plats, null, 2));
    res.json(plats[platIndex]);
});

app.delete('/api/plats/:id', async (req, res) => {
    const platId = parseInt(req.params.id);
    const filteredPlats = plats.filter(p => p.id !== platId);

    if (filteredPlats.length === plats.length) {
        return res.status(404).json({ message: 'Plat non trouvé' });
    }

    plats = filteredPlats;
    await fs.writeFile('./plats.json', JSON.stringify(plats, null, 2));
    res.json({ message: 'Plat supprimé' });
});

// Nouvelles routes pour les menus
app.get('/api/menus', (req, res) => {
    res.json(menus);
});

app.post('/api/menus', async (req, res) => {
    const newMenu = req.body;
    newMenu.id = menus.length > 0 ? Math.max(...menus.map(m => m.id)) + 1 : 1;
    menus.push(newMenu);
    await saveMenus();
    res.status(201).json(newMenu);
});

app.put('/api/menus/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const index = menus.findIndex(m => m.id === id);
    if (index !== -1) {
        menus[index] = { ...menus[index], ...req.body, id };
        await saveMenus();
        res.json(menus[index]);
    } else {
        res.status(404).json({ message: 'Menu non trouvé' });
    }
});

app.delete('/api/menus/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const index = menus.findIndex(m => m.id === id);
    if (index !== -1) {
        menus.splice(index, 1);
        await saveMenus();
        res.json({ message: 'Menu supprimé avec succès' });
    } else {
        res.status(404).json({ message: 'Menu non trouvé' });
    }
});

app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erreur interne du serveur' });
});

app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});