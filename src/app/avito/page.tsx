// import getMessages from "../db/messages/getMessages";
import getChats from "./getChats";
import getToken from "./getToken";
import dayjs from "dayjs";
import "dayjs/locale/ru"

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
        const { id: chatId } = chat;


        const newChat: any = {};
        newChat.chat_id = chatId;

        const { messages } = await getMessages(
            token, user_id, chatId
        )

        newChat.messages = messages;

        newChat.subdata = chat;

        combinedChats.push(newChat);

    }

    return <>
        <h1>Avito</h1>
        <table className="table table-striped table-bordered">
            <thead>
                <tr>
                    <th></th>
                    <th>chat id</th>
                    <th>messages</th>
                </tr>
            </thead>
            <tbody>
                {combinedChats.map((chat, i) => <tr key={chat.chat_id}>
                    <td>{i}</td>
                    <td>{chat.chat_id}
                        {(() => {
                            const zz: any = chat;
                            <pre>{JSON.stringify(zz.subdata, null, 2)}</pre>
                            return null;
                        })()}

                    </td>
                    <td>
                        <table>
                            <tbody>
                                {chat.messages.map(message => <tr>
                                    <td className="border border-dark">
                                        <div>direction {message.direction}</div>
                                        <div>type {message.type}</div>
                                        <div>создано <>
                                            {dayjs.unix(message.created).format("DD.MM.YYYY hh:mm")}
                                        </></div>
                                        <div><>
                                            {message.read ? ("прочитано: " + dayjs.unix(message.read).format("DD.MM.YYYY hh:mm")) : <>не прочитано</>}
                                        </></div>
                                        <pre>{JSON.stringify(message, null, 2)}</pre>
                                        {(() => {
                                            if (message.type === "text") {
                                                return <pre>текст: {message.content.text}</pre>
                                            }
                                            if (message.type === "image") {
                                                return <pre>текст: <img src={message.content.image.sizes["140x105"]} /></pre>
                                            }
                                            return null;
                                        })()}
                                    </td>
                                </tr>)}
                            </tbody>
                        </table>
                        {/* <pre>{JSON.stringify(chat.messages, null, 2)}</pre> */}
                    </td>
                </tr>)}
            </tbody>
        </table>
        {/* <pre>{JSON.stringify({ combinedChats }, null, 2)}</pre> */}
        <pre>{JSON.stringify({ avitoCreds, token, chats }, null, 2)}</pre>
    </>
}

interface CombinedChatInterface {
    chat_id: string;
    messages: any[]
}

interface AvitoChatInterface {

}

interface AvitoCredsInterface {
    client_id: string;
    client_secret: string;
    user_id: string;
}

async function getMessages(token: string, user_id: string, chat_id: string) {
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
    console.log('data', data.chats[0]);
}