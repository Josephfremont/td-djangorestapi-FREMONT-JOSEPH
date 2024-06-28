const postChercheurs = async (token,chercheur) => {
    return fetch(`http://127.0.0.1:8000/recherche/chercheurs`, {
        method: "POST",
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

export default postChercheurs