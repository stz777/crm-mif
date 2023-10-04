import Link from "next/link";
import getToken from "../../getToken";
import { AvitoCredsInterface } from "../../types/chats";

const avitoCreds: AvitoCredsInterface[] = JSON.parse(
    String(process.env.AVITO_ACCOUNTS)
);

export default async function Page(props: { params: { user_id: string } }) {

    const currentAcc = avitoCreds.find(acc => acc.user_id === Number(props.params.user_id));
    if (!currentAcc) {
        return <>нет аккаунта с user_id {props.params.user_id}</>
    }

    const { client_id, client_secret } = currentAcc;

    const token = await getToken(client_id, client_secret);

    const ads = await getAvitoAds(token);

    return <>
        <h1>Аккаунт #{props.params.user_id}</h1>
        <div className="row">
            {ads.resources.map(ad => <div className="col-2" key={ad.id}>
                <div className="card">
                    <div className="card-header">
                        {ad.title}
                    </div>
                    <div className="card-body">
                        <table className="table">
                            <tbody>
                                <tr><td>цена</td><td>{ad.price}</td></tr>
                                <tr><td>статус</td><td>{ad.status}</td></tr>
                                <tr><td>категория</td><td>{ad.category.name}({ad.category.id})</td></tr>
                            </tbody>
                        </table>
                        {/* https://api.avito.ru/core/v1/accounts/{user_id}/items/{item_id}/ */}
                        <Link href={`/avito/ads/single?user_id=${props.params.user_id}&ad_id=${ad.id}`} className="btn btn-sm btn-outline-dark d-block mb-2">Открыть</Link>
                        <Link href={ad.url} target="_blank" className="btn btn-sm btn-outline-dark d-block">Открыть в Авито</Link>
                        <pre>{JSON.stringify(ad, null, 2)}</pre>
                    </div>
                </div>
            </div>)}
        </div>
    </>
}

async function getAvitoAds(token: string): Promise<AvitoCoreItems> {
    const url = `https://api.avito.ru/core/v1/items`;
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
        })
        .catch(error => {
            console.error('Error №dлddпл:', error);
            return null;
        });
    return data;
}

interface AvitoCoreItems {
    meta: {
        per_page: number
        page: number
    }
    resources: AvitoAd[]
}

interface AvitoAd {
    price: number
    status: string//"active"
    title: string
    url: string
    category: {
        name: string
        id: number
    },
    id: number
}