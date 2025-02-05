import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { getUserByToken } from "@/app/components/getUserByToken";
import { pool } from "@/app/db/connect";
import dbWorker from "@/app/db/dbWorker/dbWorker";
import { cookies } from "next/headers";

export async function getRoleByLeadId(lead_id: number): Promise<string | null> {
    const auth = cookies().get('auth');
    const user = await getUserByToken(String(auth?.value));
    if (!user) return null;

    if (user.is_boss) return "boss";

    return await new Promise(resolve => {
        dbWorker(
            'SELECT role FROM leads_roles WHERE user = ? AND lead_id = ?',
            [user?.id, lead_id],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#mdSmnfjUn28dj",
                                error: err,
                                values: { lead_id },

                            }, null, 2),
                        "5050441344"
                    )
                }
                if (res?.length) {
                    resolve(res[0].role);
                } else {
                    resolve(null);
                }
            }
        )
    })
}
