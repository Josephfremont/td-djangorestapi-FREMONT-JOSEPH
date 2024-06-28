const putChercheurs = async (token,chercheur) => {
    console.log("chercheur ",chercheur)
    return fetch(`http://127.0.0.1:8000/recherche/chercheurs/${chercheur.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({
            "nom": chercheur.nom,
            "specialite": chercheur.specialite,
            "projets": chercheur.projets
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

export default putChercheurs