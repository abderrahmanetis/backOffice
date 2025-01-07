// Charger les menus depuis l'API
fetch('http://localhost:5000/api/menus')
    .then(response => response.json())
    .then(menus => afficherMenus(menus))
    .catch(error => console.error('Erreur lors du chargement des menus:', error));

// Fonction pour afficher les menus dans le tableau
function afficherMenus(menus) {
    const tbody = document.querySelector('#table-menus tbody');
    tbody.innerHTML = '';

    menus.forEach(menu => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${menu.id}</td>
            <td>${menu.nom}</td>
            <td>${menu.prix.toFixed(2)} €</td>
            <td>${menu.plats.join(', ')}</td>
            <td>
                <button onclick="modifierMenu(${menu.id})">Modifier</button>
                <button onclick="supprimerMenu(${menu.id})">Supprimer</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Fonction pour ajouter un menu
function ajouterMenu() {
    const menu = {
        nom: document.querySelector('#menu-nom').value,
        prix: parseFloat(document.querySelector('#menu-prix').value),
        plats: document.querySelector('#menu-plats').value.split(',').map(id => parseInt(id.trim()))
    };

    fetch('http://localhost:5000/api/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menu)
    })
        .then(response => response.json())
        .then(() => {
            // Recharger les menus après l'ajout
            fetch('http://localhost:5000/api/menus')
                .then(response => response.json())
                .then(menus => afficherMenus(menus));
            
            // Réinitialiser le formulaire
            document.querySelector('#form-menu').reset();
        })
        .catch(error => console.error('Erreur lors de l\'ajout du menu:', error));
}

// Fonction pour modifier un menu
function modifierMenu(id) {
    const nom = prompt('Entrez le nouveau nom du menu :');
    const prix = parseFloat(prompt('Entrez le nouveau prix :'));
    const plats = prompt('Entrez les nouveaux IDs des plats (séparés par des virgules) :').split(',').map(id => parseInt(id.trim()));

    const menu = { nom, prix, plats };

    fetch(`http://localhost:5000/api/menus/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menu)
    })
        .then(response => response.json())
        .then(() => {
            // Recharger les menus après la modification
            fetch('http://localhost:5000/api/menus')
                .then(response => response.json())
                .then(menus => afficherMenus(menus));
        })
        .catch(error => console.error('Erreur lors de la modification du menu:', error));
}

// Fonction pour supprimer un menu
function supprimerMenu(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce menu ?')) {
        fetch(`http://localhost:5000/api/menus/${id}`, { method: 'DELETE' })
            .then(() => {
                // Recharger les menus après la suppression
                fetch('http://localhost:5000/api/menus')
                    .then(response => response.json())
                    .then(menus => afficherMenus(menus));
            })
            .catch(error => console.error('Erreur lors de la suppression du menu:', error));
    }
}

// Ajouter un écouteur d'événements pour le formulaire d'ajout de menu
document.querySelector('#form-menu').addEventListener('submit', function(e) {
    e.preventDefault();
    ajouterMenu();
});

// Charger les menus au chargement de la page
fetch('http://localhost:5000/api/menus')
    .then(response => response.json())
    .then(menus => afficherMenus(menus))
    .catch(error => console.error('Erreur lors du chargement initial des menus:', error));