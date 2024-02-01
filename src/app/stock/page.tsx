import getStockFromDB from "../db/stock/getStockFromDB";
import Client from "./client";

export default async function Page() {
    const materials = await getStockFromDB();
    return <>
        <Client materials={materials} />
    </>
}