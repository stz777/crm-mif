import { getAvitoMessages } from "./getAvitoMessages";
import getAvitoChats from "./getAvitoChats";
import getToken from "./getToken";
import dayjs from "dayjs";
import "dayjs/locale/ru"
import { AvitoCredsInterface } from "./types/chats";
import Link from "next/link";

const avitoCreds: AvitoCredsInterface[] = JSON.parse(
    String(process.env.AVITO_ACCOUNTS)
);

export default async function Page() {

    const { client_id, client_secret, user_id } = avitoCreds[0];

    const token = await getToken(client_id, client_secret);

    const { chats } = await getAvitoChats(token, user_id);

    const combinedChats: CombinedChatInterface[] = [];

    for (let index = 0; index < chats.length; index++) {
        const chat = chats[index];
        const { id: chatId } = chat;


        const newChat: any = {};
        newChat.chat_id = chatId;

        const { messages } = await getAvitoMessages(
            token, user_id, chatId
        )

        newChat.messages = messages;

        newChat.subdata = chat;

        combinedChats.push(newChat);

    }

    return <>
        <h1>Avito</h1>
        <strong>Аккаунты</strong>
        <ul>
            {avitoCreds.map(
                acc => <li>
                    <Link href={`/avito/accounts/${acc.user_id}`}>{acc.user_id}</Link>
                    {/* {JSON.stringify(acc)} */}
                </li>
            )}
        </ul>
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
