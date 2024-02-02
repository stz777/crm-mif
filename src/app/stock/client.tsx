"use client"
import { useEffect, useState } from "react";
import { StockInterface } from "../components/types/stock";
import CreateMaterial from "./CreateMaterial";
import fetchStock from "./fetchStock";
import AddWriteOff from "./AddWriteOff";

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
        <h1>Склад</h1>
        <div className="d-flex justify-content-between">
            <div className="d-flex">
                <CreateMaterial />
            </div>
        </div>
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
                                    {/* <button className="btn btn-outline-dark btn-sm">Списать</button> */}
                                </div>
                                <div><button className="btn btn-outline-dark btn-sm">Пополнить</button></div>
                            </div>


                        </td>
                    </tr>)}
                    <tr></tr>
                </tbody>
            </table>
        </div>
    </>
}
