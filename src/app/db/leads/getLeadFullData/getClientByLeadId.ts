import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { ClientInterface, ClientMetaInterface } from "@/app/components/types/clients";
import { pool } from "@/app/db/connect";
import getClentMeta from "../../clients/getClentMeta";

type superInterface = ClientInterface & { meta: ClientMetaInterface[] };

export default async function getClientByLeadId(lead_id: number): Promise<superInterface> {
    const client: ClientInterface = await new Promise((resolve) => {
        pool.query(
            `SELECT * FROM clients WHERE 
            id IN (SELECT client FROM leads WHERE id = ? )
            ORDER BY id DESC`,
            [lead_id],
            function (err, result: any[]) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#kd55m",
                                error: err,
                                values: { lead_id }
                            }, null, 2),
                        "5050441344"
                    )
                    // resolve(null)
                }
                if (!result.length) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#n328m3nc",
                                error: "Запросили клиента, которого нет",
                                values: { lead_id }
                            }, null, 2),
                        "5050441344"
                    )
                    // resolve(null)
                } else {
                    resolve(result[0])
                }
            }
        )
    });
    const client_meta = await getClentMeta(client.id);
    return {
        ...client,
        meta: client_meta
    };
}