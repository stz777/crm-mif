import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { SupplierInterface } from "@/app/components/types/supplierInterface";
import { pool } from "@/app/db/connect";

export default async function Page({ params }: { params: { id: number } }) {
    const { id: suplierId } = params;

    const supplier = await getSupplierById(suplierId);

    return <>
        <h1>Поставщик</h1>
        <table className="table w-auto">
            <tbody>
                <tr><td>Наименование</td><td>{supplier.name}</td></tr>
                <tr><td>Контакты</td><td>{supplier.contacts}</td></tr>
            </tbody>
        </table>
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
