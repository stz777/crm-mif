"use client"
import { useEffect, useState } from "react";
import { StockInterface } from "../components/types/stock";
import fetchStock from "./fetchStock";
import AddWriteOff from "./AddWriteOff";
import AddReplenishment from "./AddReplenishment";

export default function Client(props: { materials: StockInterface[] }) {
    const [stock, setStock] = useState(props.materials);
    useEffect(() => {
        let mount = true;
        (async function refreshData() {
            if (!mount) return;
            await new Promise(resolve => { setTimeout(() => { resolve(1); }, 1000); });
            const response = await fetchStock();
            if (JSON.stringify(stock) !== JSON.stringify(response.stock)) {
                setStock(response.stock);
            }
            await refreshData();
        })();
        return () => { mount = false; }
    }, [stock,])

    return <>
        <div>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Наименование</th>
                        <th>Кол-во шт.</th>
                    </tr>
                </thead>
                <tbody>
                    {stock.map(material => <tr key={material.id}>
                        <td>{material.id}</td>
                        <td>{material.material}</td>
                        <td>{material.count}</td>
                        <td className="text-right">
                            <div className="d-flex justify-content-end">
                                <div className="me-2">
                                    <AddWriteOff material={material} />
                                </div>
                                <div>
                                    <AddReplenishment material={material} />
                                </div>
                            </div>
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </div>
    </>
}
