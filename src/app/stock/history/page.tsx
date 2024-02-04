import { pool } from "@/app/db/connect";
import Client from "./client";

export default async function Page() {
    const history = await getStockHistoryFromDB();
    return <>
        <Client history={history} />
    </>
}

async function getStockHistoryFromDB() {
    return pool.promise().query(`SELECT stock_history.* FROM stock_history
    `)
        .then(([res]: any) => res)
        .catch((error: any) => {
            console.error('error #fjfdsfn', error);
            return [];
        })
}

