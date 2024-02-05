"use client"
import { StockHistory } from "@/app/components/types/stock";
import { useEffect, useState } from "react";
import fetchStockHistory from "./fetchStockHistory";
import dayjs from "dayjs";
import Link from "next/link";
import PageTmp from "@/app/ui/tmp/page/PageTmp";

export default function Client(props: {
    history: StockHistory[]
}) {

    const [stockHistory, setStockHistory] = useState(props.history);

    useEffect(() => {
        if (!stockHistory) return;
        let mount = true;
        (async function refreshData() {
            if (!mount) return;
            await new Promise(resolve => { setTimeout(() => { resolve(1); }, 1000); });
            const response = await fetchStockHistory();
            if (JSON.stringify(stockHistory) !== JSON.stringify(response.stockHistory)) {
                setStockHistory(response.stockHistory);
            }
            await refreshData();
        })();
        return () => { mount = false; }
    }, [props.history])

    return <>
        <PageTmp
            title="Склад (История)"
            filter={<div className="d-flex justify-content-between">
                <div></div>
                <Link href={"/stock"} className="btn btn-outline-dark">Скрыть историю</Link>
            </div>}
        >
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Наименование</th>
                            <th>Сотрудник</th>
                            <th>Дата</th>
                            <th>Тип операции</th>
                            <th>Кол-во штук</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stockHistory.map(historyItem => <tr key={historyItem.id}>
                            <td>{historyItem.material_name}</td>
                            <td>{historyItem.username}</td>
                            <td>{dayjs(historyItem.created_date).format("DD.MM.YYYY")}</td>
                            <td>{historyItem.is_adjunction ? <span className="text-success">Пополнение</span> : <span className="text-danger">Списание</span>}</td>
                            <td><span className={`text-${historyItem.is_adjunction ? "success" : "danger"}`}>{historyItem.is_adjunction ? "+" : "-"}{historyItem.count}</span></td>
                        </tr>)}
                    </tbody>
                </table>
            </div>
        </PageTmp>


    </>
}
