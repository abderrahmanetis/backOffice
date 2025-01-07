document.addEventListener("DOMContentLoaded", function () {
    const formCommande = document.getElementById("form-commande");
    const tableCommandes = document.getElementById("table-commandes").getElementsByTagName('tbody')[0];
    let commandes = JSON.parse(localStorage.getItem("commandes")) || [];
    let nextCommandeId = commandes.length ? commandes[commandes.length - 1].id + 1 : 1;

    // Fonction pour afficher les commandes dans la table
    function afficherCommandes() {
        tableCommandes.innerHTML = "";
        commandes.forEach(commande => {
            let row = tableCommandes.insertRow();
            row.innerHTML = `
                <td>${commande.id}</td>
                <td>${commande.clientId}</td>
                <td>${commande.menuIds.join(", ")}</td>
                <td>${commande.date}</td>
                <td>${commande.status}</td>
                <td>
                    <button class="btn btn-warning" onclick="modifierCommande(${commande.id})">Modifier</button>
                    <button class="btn btn-danger" onclick="supprimerCommande(${commande.id})">Supprimer</button>
                </td>
            `;
        });
    }

    // Ajouter une commande
    formCommande.addEventListener("submit", function (e) {
        e.preventDefault();
        const clientId = parseInt(document.getElementById("commande-client").value);
        const menuIds = document.getElementById("commande-menus").value.split(",").map(id => parseInt(id.trim()));
        const date = document.getElementById("commande-date").value;
        const status = "En préparation"; // Par défaut

        const newCommande = { id: nextCommandeId++, clientId, menuIds, date, status };
        commandes.push(newCommande);
        localStorage.setItem("commandes", JSON.stringify(commandes));
        afficherCommandes();
        formCommande.reset();
    });

    // Modifier une commande
    window.modifierCommande = function(id) {
        const commande = commandes.find(c => c.id === id);
        if (commande) {
            const clientId = prompt("Client ID:", commande.clientId);
            const menuIds = prompt("Menu IDs (séparés par des virgules):", commande.menuIds.join(", "));
            const date = prompt("Date:", commande.date);
            const status = prompt("Statut:", commande.status);

            if (clientId && menuIds && date && status) {
                commande.clientId = parseInt(clientId);
                commande.menuIds = menuIds.split(",").map(id => parseInt(id.trim()));
                commande.date = date;
                commande.status = status;

                localStorage.setItem("commandes", JSON.stringify(commandes));
                afficherCommandes();
            }
        }
    };

    // Supprimer une commande
    window.supprimerCommande = function(id) {
        commandes = commandes.filter(commande => commande.id !== id);
        localStorage.setItem("commandes", JSON.stringify(commandes));
        afficherCommandes();
    };

    afficherCommandes();
});
