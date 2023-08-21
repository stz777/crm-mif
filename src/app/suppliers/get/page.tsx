import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { pool } from "@/app/db/connect"
import Link from "next/link";

export default async function Page() {
    const suppliers = await getSuppliers();
    return <>
        <h1>Поставщики</h1>
        <table className="table table-bordered table-striped w-auto">
            <thead>
                <tr className="sticky-top">
                    <th>номер</th>
                    <th>Наименование</th>
                    <th>Контакты</th>
                </tr>
            </thead>
            <tbody>
                {suppliers.map((supplier, i) => <tr key={supplier.id}>
                    <td><Link href={`/suppliers/single/${supplier.id}`}>Поставщик #{supplier.id}</Link></td>
                    <td>{supplier.name}</td>
                    <td><pre style={{ font: "initial" }} className="m-0 p-0">{supplier.contacts}</pre></td>
                </tr>)}
            </tbody>
        </table>
    </>
}

async function getSuppliers(): Promise<SupplierInterface[]> {
    return await new Promise(r => {
        pool.query("SELECT * FROM suppliers", function (err: any, res: SupplierInterface[]) {
            if (err) {
                sendMessageToTg(
                    JSON.stringify(
                        {
                            errorNo: "#ndsj3Jjd",
                            error: err,
                            values: {}
                        }, null, 2),
                    "5050441344"
                )
            }
            r(res ? res : []);
        })
    });
}

export interface SupplierInterface {
    id: number
    name: string
    contacts: string
}
