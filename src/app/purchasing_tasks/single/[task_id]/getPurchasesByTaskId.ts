import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { PurchaseInterface } from "@/app/components/types/purchase";
import { pool } from "@/app/db/connect";
import dbWorker from "@/app/db/dbWorker/dbWorker";

export async function getPurchasesByTaskId(task_id: number): Promise<PurchaseInterface[]> {
    return await new Promise(r => {
        dbWorker(`SELECT expenses_per_purchase_task.*, materials.name as material_name
        FROM expenses_per_purchase_task
        INNER JOIN materials
        ON materials.id = expenses_per_purchase_task.materials
        WHERE expenses_per_purchase_task.purchase_task = ?
        `,
            // dbWorkerrrr("SELECT * FROM expenses_per_purchase_task WHERE id = ?",
            [task_id],
            function (err: any, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#djsmcs4ms",
                                error: err,
                                values: { task_id }
                            }, null, 2),
                        "5050441344"
                    )
                }
                r(res ? res : []);
            })
    });
}
