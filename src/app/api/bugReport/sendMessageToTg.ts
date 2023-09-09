
const token = process.env.TELEGRAM_BOT_TOKEN;

export async function sendMessageToTg(message: string, chat_id?: string) {
    const url = `https://api.telegram.org/bot${token}/sendMessage`
    return await fetch(
        url,
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            cache: "no-cache",
            body: JSON.stringify({
                chat_id: chat_id ? chat_id : "5050441344",
                text: message,
            })
        }
    )
        .then(x => x.json())
        .then(x => {
            return x;
        })
}
