import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { PurchaseTaskInterface } from "@/app/components/types/purchaseTask";
import { pool } from "@/app/db/connect";
import dbWorker from "@/app/db/dbWorker/dbWorker";

export async function getPurchaseTaskById(task_id: number): Promise<PurchaseTaskInterface> {
    return await new Promise(r => {
        dbWorker(`SELECT 
            * FROM 
            purchasing_tasks WHERE id = ?`,
            [task_id],
            function (err: any, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#dmdk4ndnN",
                                error: err,
                                values: { task_id }
                            }, null, 2),
                        "5050441344"
                    )
                }
                r(res?.pop());
            })
    });
}