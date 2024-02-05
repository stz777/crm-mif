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

    if(searchParams.materialId){
        arr.push(``)
    }

    const searchParamsEntries = Object.entries(searchParams).filter(x => x[1].length);
    console.log(searchParamsEntries);

    const columns = searchParamsEntries.map(([column]) => column);
    const values = searchParamsEntries.map(([_, value]) => `"${value}"`);

    // const whereColumns = searchParamsEntries.length? `  WHERE `

    const whereString = searchParamsEntries.length ? ` WHERE ` : "";

    console.log({
        columns,
        values
    });


    /*
    составить набор where параметров по объекту
    */

    // console.log('searchParams', searchParams);

    return pool
        .promise()
        .query(
            `SELECT stock_history.*, employees.username, stock.material AS material_name FROM stock_history
                INNER JOIN employees ON employees.id = stock_history.done_by
                INNER JOIN stock ON stock.id = stock_history.material
                
      `
        )
        .then(([res]: any) => res)
        .catch((error: any) => {
            console.error("error #fjfdsfn", error);
            return [];
        });
}
