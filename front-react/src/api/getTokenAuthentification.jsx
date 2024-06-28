const getTokenAuthentification = async (username,password) => {
    return fetch(`http://127.0.0.1:8000/recherche/api-token-auth`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "username": username,
            "password": password,
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

export default getTokenAuthentification