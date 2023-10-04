export async function getAvitoMessages(token: string, user_id: number, chat_id: string) {
    const url = `https://api.avito.ru/messenger/v3/accounts/${user_id}/chats/${chat_id}/messages/`;
    const data = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not OK');
            }
            return response.json();
        })
        .then(data => {
            return data;
            // console.log(data);
        })
        .catch(error => {
            console.error('Error №dлпл:', error);
            return null;
        });
    return data;
}