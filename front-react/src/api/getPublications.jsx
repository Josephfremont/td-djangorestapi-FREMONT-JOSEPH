const getPublications = async (token) => {
    return fetch(`http://127.0.0.1:8000/recherche/publications`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
    })
        .then((response) => response.json())
        .then((data) => {
            return data
        })
        .catch((error) => {
            console.error(error)
        })
}

export default getPublications