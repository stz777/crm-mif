import { pool } from "@/app/db/connect";
import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { LeadInterface } from "@/app/components/types/lead";

export async function getLeadsPerClientId(
    clientId: number
): Promise<LeadInterface[]> {

    const leads: LeadInterface[] = await new Promise(r => {
        pool.query(
            `SELECT * FROM leads WHERE client = ? ORDER BY id DESC`,
            [clientId],
            function (err: any, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#mcfr73g3f",
                                error: err,
                                values: {}
                            }, null, 2),
                        "5050441344"
                    )
                }
                r(res);
            }
        )
    });
    return leads;
}