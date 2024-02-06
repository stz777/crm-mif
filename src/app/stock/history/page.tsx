import Client from "./client";
import { SearchParamsInterface } from "./types";
import PageTmp from "@/app/ui/tmp/page/PageTmp";
import Filter from "./Filter";
import Link from "next/link";
import { pool } from "@/app/db/connect";

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


async function getStockHistoryFromDB(searchParams: SearchParamsInterface) {
    const arr = [];
    if (searchParams.is_adjunction) arr.push(`stock_history.is_adjunction = ${Number(searchParams.is_adjunction)}`);
    const whereSubStr = arr.length ? (" WHERE " + arr.join(" AND ")) : "";
    const qs = `SELECT stock_history.*, employees.username, stock.material AS material_name FROM stock_history
INNER JOIN employees ON employees.id = stock_history.done_by
INNER JOIN stock ON stock.id = stock_history.material
${whereSubStr}
`;

    return pool
        .promise()
        .query(
            qs
        )
        .then(([res]: any) => res)
        .catch((error: any) => {
            console.error("error #fjfdsfn", error);
            return [];
        });
}
