import { pool } from "@/app/db/connect";

export default async function createClientFn(fio: string): Promise<number> {
    return await new Promise(r => {
        pool.query(
            `INSERT INTO clients (full_name) VALUES (?)`,
            [fio],
            function (err, res: any) {
                if (err) {
                    console.log('err #djb39f', err);
                }
                r(res.insertId);
            })
    })

}