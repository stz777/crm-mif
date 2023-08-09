import { db_connection } from "@/app/db/connect";

export default async function createClientMetaFn({ client, data_type, data }: ClientMetaType) {
    return await new Promise(r => {
        db_connection.query(
            `INSERT INTO clients ( client, data_type, data) VALUES (?,?,?)`,
            [client, data_type, data],
            function (err, res: any) {
                if (err) {
                    console.log('err #k3k5n60', err);
                }
                r(res.insertId);
            })
    })
}

interface ClientMetaType {
    client: number
    data_type: "phone" | "email" | "telegram"
    data: string
}