import { pool } from '@/app/db/connect';
import { NextResponse } from 'next/server'
import { sendMessageToTg } from '../../bugReport/sendMessageToTg';
import { getUserByToken } from '@/app/components/getUserByToken';
import { cookies } from 'next/headers';
import dbWorker from '@/app/db/dbWorker/dbWorker';

export async function POST(req: any, res: any) {

    const auth = cookies().get('auth');
    if (!auth?.value) return new Response("Кто ты", { status: 401, });;
    const user = await getUserByToken(auth?.value);
    if (!user) return new Response("Кто ты", { status: 401, });;
    if (!user.is_manager) return new Response("Кто ты", { status: 401, });;


    const { name, supplier_id } = await req.json();
    const newMaterial = await createClientFn(name, supplier_id);
    return NextResponse.json({
        success: !!newMaterial,
    });
}

async function createClientFn(name: string, supplier_id: number): Promise<number> {
    return await new Promise(r => {
        dbWorker(
            `INSERT INTO materials (name, supplier) VALUES (?,?)`,
            [name, supplier_id],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#djslL39f",
                                error: err,
                                values: { name }
                            }, null, 2),
                        "5050441344"
                    )
                }
                if (res) {
                    sendMessageToTg(
                        [
                            `Создан новый материал`,
                            `id: ${res.insertId}`,
                            `наименование:  ${name}`,
                        ].join("\n"),
                        "5050441344"
                    )
                }
                r(res?.insertId);
            })
    })

}