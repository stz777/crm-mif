import { pool } from "@/app/db/connect";
import { sendMessageToTg } from "../../bugReport/route";

export default async function createClientMetaFn({ client, data_type, data }: ClientMetaType) {
    return await new Promise(r => {
        pool.query(
            `INSERT INTO clients_meta ( client, data_type, data) VALUES (?,?,?)`,
            [client, data_type, data],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#k3k5n60",
                                error: err,
                                values: { client, data_type, data }
                            }, null, 2),
                        "5050441344"
                    )
                }
                if (res)
                    r(res.insertId);
            })
    })
}

interface ClientMetaType {
    client: number
    data_type: "phone" | "email" | "telegram"
    data: string
}