const deleteProjets = async (token,id) => {
    return fetch(`http://127.0.0.1:8000/recherche/projets/${id}`, {
        method: "DELETE",
        headers: {
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

export default deleteProjets