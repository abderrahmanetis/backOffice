document.addEventListener("DOMContentLoaded", function () {
    const formClient = document.getElementById("form-client");
    const tableClients = document.getElementById("table-clients").getElementsByTagName('tbody')[0];
    let clients = JSON.parse(localStorage.getItem("clients")) || [];
    let editingClientId = null;  // ID du client en cours de modification

    // Fonction pour afficher les clients dans la table
    function afficherClients() {
        tableClients.innerHTML = "";
        clients.forEach(client => {
            let row = tableClients.insertRow();
            row.innerHTML = `
                <td>${client.id}</td>
                <td>${client.nom}</td>
                <td>${client.email}</td>
                <td>${client.telephone}</td>
                <td>
                    <button class="btn btn-warning" onclick="modifierClient(${client.id})">Modifier</button>
                    <button class="btn btn-danger" onclick="supprimerClient(${client.id})">Supprimer</button>
                </td>
            `;
        });
    }

    // Ajouter ou modifier un client
    formClient.addEventListener("submit", function (e) {
        e.preventDefault();
        const nom = document.getElementById("client-nom").value;
        const email = document.getElementById("client-email").value;
        const telephone = document.getElementById("client-telephone").value;

        if (editingClientId) {
            // Modifier un client existant
            const client = clients.find(c => c.id === editingClientId);
            if (client) {
                client.nom = nom;
                client.email = email;
                client.telephone = telephone;
            }
            editingClientId = null; // Réinitialiser l'ID du client en modification
        } else {
            // Ajouter un nouveau client
            const newId = clients.length ? clients[clients.length - 1].id + 1 : 1;
            const newClient = {
                id: newId,
                nom: nom,
                email: email,
                telephone: telephone
            };
            clients.push(newClient);
        }

        localStorage.setItem("clients", JSON.stringify(clients));
        formClient.reset();
        afficherClients();
    });

    // Modifier un client
    window.modifierClient = function(id) {
        const client = clients.find(c => c.id === id);
        if (client) {
            // Remplir les champs du formulaire avec les données du client à modifier
            document.getElementById("client-nom").value = client.nom;
            document.getElementById("client-email").value = client.email;
            document.getElementById("client-telephone").value = client.telephone;

            // Marquer l'ID du client en cours de modification
            editingClientId = id;
        }
    };

    // Supprimer un client
    window.supprimerClient = function(id) {
        clients = clients.filter(c => c.id !== id);
        localStorage.setItem("clients", JSON.stringify(clients));
        afficherClients();
    };

    afficherClients();
});
