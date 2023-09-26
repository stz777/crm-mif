import getChats from "./getChats";
import getToken from "./getToken";

const avitoCreds: AvitoCredsInterface[] = JSON.parse(
    String(process.env.AVITO_ACCOUNTS)
);

export default async function Page() {

    const { client_id, client_secret, user_id } = avitoCreds[0];

    const token = await getToken(client_id, client_secret);

    const { chats } = await getChats(token, user_id);

    const combinedChats: CombinedChatInterface[] = [];

    for (let index = 0; index < chats.length; index++) {
        const chat = chats[index];
        const newChat: any = {};
        newChat.id = chat.id;
        combinedChats.push(newChat);
        break;
    }

    return <>
        <h1>Avito</h1>
        <table className="table table-striped table-bordered">
            <thead>
                <tr>
                    <th></th>
                    <th>chat id</th>
                </tr>
            </thead>
            <tbody>
                {chats.map((chat, i) => <tr key={chat.id}>
                    <td>{i}</td>
                    <td>{chat.id}</td>
                </tr>)}
            </tbody>
        </table>
        <pre>{JSON.stringify({ combinedChats }, null, 2)}</pre>
        {/* <pre>{JSON.stringify({ avitoCreds, token, chats }, null, 2)}</pre> */}
    </>
}

interface CombinedChatInterface {

}

interface AvitoCredsInterface {
    client_id: string;
    client_secret: string;
    user_id: string;
}