export default async function getChats(token: string, user_id: string): Promise<AvitoChatInterface> {
    const url = `https://api.avito.ru/messenger/v2/accounts/${user_id}/chats`;
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

interface AvitoChatInterface {
    chats: {
        id: string;
    }[]
}