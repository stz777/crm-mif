export default async function getToken(
    client_id: string, client_secret: string
) {
    const formData = new URLSearchParams();
    formData.append("client_id", client_id);
    formData.append("client_secret", client_secret);
    formData.append("grant_type", "client_credentials");

    return await fetch('https://api.avito.ru/token', {
        method: 'POST',
        body: formData,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not OK');
            }
            return response.json();
        })
        .then(data => {
            console.log('data #sd4', data);
            return data.access_token;
        })
        .catch(error => {
            console.error('Error №плпл:', error);
            return null;
        });

}