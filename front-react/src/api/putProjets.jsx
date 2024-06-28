const putProjets = async (token,projet) => {
    return fetch(`http://127.0.0.1:8000/recherche/projets/${projet.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({
            "titre" : projet.titre,
            "description" : projet.description,
            "date_debut" : projet.date_debut,
            "date_fin_prevue" : projet.date_fin_prevue,
            "chef_projet" : projet.chef_projet
        })
    })
        .then((response) => response.json())
        .then((data) => {
            return data
        })
        .catch((error) => {
            console.error(error)
        })
}

export default putProjets