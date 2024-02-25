import Link from "next/link";
import getStockFromDB from "../db/stock/getStockFromDB";
import PageTmp from "../ui/tmp/page/PageTmp";
import CreateMaterial from "./CreateMaterial";
import Client from "./client";

export default async function Page() {
    const materials = await getStockFromDB();
    return <>
        <PageTmp title={"Склад"}
            filter={<>
                <div className="d-flex justify-content-between">
                    <CreateMaterial />
                    <Link href={"/stock/history"} className="btn btn-outline-dark text-nowrap">Показать историю</Link>
                </div>
            </>}
        >
            <Client materials={materials} />
        </PageTmp>
    </>
}