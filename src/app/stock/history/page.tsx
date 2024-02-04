import Client from "./client";
import getStockHistoryFromDB from "@/app/db/stock/getStockHistoryFromDB";

export default async function Page() {
    const history = await getStockHistoryFromDB();
    return <>
        <Client history={history} />
    </>
}