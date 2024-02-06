import Client from "./client";
import { SearchParamsInterface } from "./types";
import PageTmp from "@/app/ui/tmp/page/PageTmp";
import Filter from "./Filter";
import Link from "next/link";
import getStockHistoryFromDB from "./getStockHistoryFromDB";

export default async function Page(props: { searchParams: SearchParamsInterface; }) {
    const history = await getStockHistoryFromDB(props.searchParams);
    return <>
        <PageTmp
            title="Склад (История)"
            filter={<div className="d-flex justify-content-between">
                <div><Filter stockHistory={history} searchParams={props.searchParams} /></div>
                <Link href={"/stock"} className="btn btn-outline-dark">Скрыть историю</Link>
            </div>}
        >
            <Client history={history} searchParams={props.searchParams} />
        </PageTmp>
    </>
}
