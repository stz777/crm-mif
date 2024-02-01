"use client"
import { StockInterface } from "../components/types/stock";
import CreateMaterial from "./CreateMaterial";

export default function Client(props: { materials: StockInterface[] }) {
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
                    {props.materials.map(material => <tr key={material.id}>
                        <td>{material.id}</td>
                        <td>{material.material}</td>
                        <td>{material.count}</td>
                    </tr>)}
                    <tr></tr>
                </tbody>
            </table>
        </div>
    </>
}
