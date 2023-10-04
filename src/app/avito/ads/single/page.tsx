// import getAvitoChats from "../../getAvitoChats";
import getToken from "../../getToken";
import { AvitoCredsInterface } from "../../types/chats";

const avitoCreds: AvitoCredsInterface[] = JSON.parse(
    String(process.env.AVITO_ACCOUNTS)
);

export default async function Page(props: { searchParams: { user_id: string, ad_id: string } }) {
    // console.log(props);

    const currentAcc = avitoCreds.find(acc => acc.user_id === Number(props.searchParams.user_id));

    if (!currentAcc) return <>
        нет аккаунта {props.searchParams.user_id}
    </>

    const { client_id, client_secret, user_id } = currentAcc;

    const token = await getToken(client_id, client_secret);

    const ad = await getAvitoAd(
        token, user_id, props.searchParams.ad_id
    )

    return <>
        <h1>Объявление #{props.searchParams.ad_id}</h1>
        <pre>{JSON.stringify(ad, null, 2)}</pre>
    </>

}

async function getAvitoAd(token: string, client_id: number, ad_id: string): Promise<AvitoAdInterface> {
    const url = `https://api.avito.ru/core/v1/accounts/${client_id}/items/${ad_id}/`;
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
            console.log('data #dv6', data);

            return data;
        })
        .catch(error => {
            console.error('Error №d4fлпл:', error);
            return null;
        });
    return data;
}

interface AvitoAdInterface {

}