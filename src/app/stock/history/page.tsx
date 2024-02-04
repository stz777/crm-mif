import { pool } from "@/app/db/connect";
import Client from "./client";

export default async function Page() {
    const history = await getStockHistoryFromDB();
    return <>
        <Client history={history} />
    </>
}

async function getStockHistoryFromDB() {
    return pool.promise().query(`SELECT stock_history.*, employees.username, stock.material AS material_name FROM stock_history
    INNER JOIN employees ON employees.id = stock_history.done_by
    INNER JOIN stock ON stock.id = stock_history.material
    `)
        .then(([res]: any) => res)
        .catch((error: any) => {
            console.error('error #fjfdsfn', error);
            return [];
        })
}

