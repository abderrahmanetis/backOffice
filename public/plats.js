// Charger les plats depuis l'API
fetch('http://localhost:5000/api/plats')
    .then(response => response.json())
    .then(plats => afficherPlats(plats))
    .catch(error => console.error('Erreur lors du chargement des plats:', error));

// Fonction pour afficher les plats dans le tableau
function afficherPlats(plats) {
    const tbody = document.querySelector('#table-plats tbody');
    tbody.innerHTML = '';

    plats.forEach(plat => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${plat.id}</td>
            <td>${plat.nom}</td>
            <td>${plat.prix.toFixed(2)} €</td>
            <td>${plat.categorie}</td>
            <td>${plat.disponibilite ? 'Oui' : 'Non'}</td>
            <td>
                <button onclick="modifierPlat(${plat.id})">Modifier</button>
                <button onclick="supprimerPlat(${plat.id})">Supprimer</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Fonction pour ajouter un plat
function ajouterPlat() {
    const plat = {
        nom: document.querySelector('#nom').value,
        prix: parseFloat(document.querySelector('#prix').value),
        categorie: document.querySelector('#categorie').value,
        disponibilite: document.querySelector('#disponibilite').checked
    };

    fetch('http://localhost:5000/api/plats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plat)
    })
        .then(response => response.json())
        .then(() => location.reload())
        .catch(error => console.error('Erreur lors de l\'ajout du plat:', error));
}

// Fonction pour modifier un plat
function modifierPlat(id) {
    const nom = prompt('Entrez le nouveau nom du plat :');
    const prix = parseFloat(prompt('Entrez le nouveau prix :'));
    const categorie = prompt('Entrez la nouvelle catégorie :');
    const disponibilite = confirm('Le plat est-il disponible ?');

    const plat = { nom, prix, categorie, disponibilite };

    fetch(`http://localhost:5000/api/plats/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plat)
    })
        .then(response => response.json())
        .then(() => location.reload())
        .catch(error => console.error('Erreur lors de la modification du plat:', error));
}

// Fonction pour supprimer un plat
function supprimerPlat(id) {
    fetch(`http://localhost:5000/api/plats/${id}`, { method: 'DELETE' })
        .then(() => location.reload())
        .catch(error => console.error('Erreur lors de la suppression du plat:', error));
}
