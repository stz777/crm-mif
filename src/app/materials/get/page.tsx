import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { getUserByToken } from "@/app/components/getUserByToken";
import { MaterialInterface } from "@/app/components/types/material";
import { pool } from "@/app/db/connect";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
    const auth = cookies().get('auth');
    if (!auth?.value) return redirect("/");
    const user = await getUserByToken(auth?.value);
    if (!user) return redirect("/");
    if (!user.is_manager) return redirect("/");
    const materials = await getMaterials();
    return <>
        <h1>Материалы</h1>
        <table className="table table-bordered table-striped w-auto">
            <thead>
                <tr>
                    <th>артикул</th>
                    <th>наименование</th>
                    <th>поставщик</th>
                </tr>
            </thead>
            <tbody>
                {materials.map(material => <tr key={material.id}>
                    <td>{material.id}</td>
                    <td>{material.name}</td>
                    <td> <Link href={`/suppliers/single/${material.supplier}`}>Поставщик #{material.supplier}</Link></td>
                </tr>)}
            </tbody>
        </table>
    </>
}


async function getMaterials(): Promise<MaterialInterface[]> {
    return await new Promise(r => {
        pool.query("SELECT * FROM materials", function (err: any, res: MaterialInterface[]) {
            if (err) {
                sendMessageToTg(
                    JSON.stringify(
                        {
                            errorNo: "#dnd9as",
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
