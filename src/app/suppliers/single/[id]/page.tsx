import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { MaterialInterface } from "@/app/components/types/material";
import { SupplierInterface } from "@/app/components/types/supplierInterface";
import { pool } from "@/app/db/connect";
import Link from "next/link";

export default async function Page({ params }: { params: { id: number } }) {
    const { id: suplierId } = params;
    const supplier = await getSupplierById(suplierId);
    const materials = await getMaterialsBySupplierId(suplierId);
    return <>
        <h1>Поставщик</h1>
        <table className="table w-auto">
            <tbody>
                <tr><td>Наименование</td><td>{supplier.name}</td></tr>
                <tr><td>Контакты</td><td>{supplier.contacts}</td></tr>
            </tbody>
        </table>
        <h3>Материалы от поставщика</h3>

        {materials ? <table className="table table-bordered table-striped w-auto">
            <thead>
                <tr>
                    <th>наименование</th>
                </tr>
            </thead>
            <tbody>
                {materials.map(material => <tr key={material.id}>
                    <td>{material.name}</td>
                </tr>)}
            </tbody>
        </table> : <>нет материалов</>}


        <Link href={`/materials/create/${suplierId}`} className="btn btn-outline-dark btn-sm">Добавить материал</Link>

    </>
}

export async function getSupplierById(supplierId: number): Promise<SupplierInterface> {
    return await new Promise(r => {
        pool.query("SELECT * FROM suppliers WHERE id = ?",
            [supplierId],
            function (err: any, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#ndmNydi03Jjd",
                                error: err,
                                values: { supplierId }
                            }, null, 2),
                        "5050441344"
                    )
                }
                r(res?.pop());
            })
    });
}



export async function getMaterialsBySupplierId(supplierId: number): Promise<MaterialInterface[]> {
    return await new Promise(r => {
        pool.query("SELECT * FROM materials WHERE supplier = ?",
            [supplierId],
            function (err: any, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#msn3nsJdhb",
                                error: err,
                                values: { supplierId }
                            }, null, 2),
                        "5050441344"
                    )
                }
                r(res);
            })
    });
}
