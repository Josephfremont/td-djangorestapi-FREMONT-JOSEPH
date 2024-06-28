const postPublications = async (token,publication) => {
    return fetch(`http://127.0.0.1:8000/recherche/publications`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({
            "titre": publication.titre,
            "resume": publication.resume,
            "projet_associe": publication.projet_associe,
            "date_publication": publication.date_publication
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

export default postPublications