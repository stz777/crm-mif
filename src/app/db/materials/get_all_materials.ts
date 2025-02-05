import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg"
import { pool } from "../connect"
import { MaterialInterface } from "@/types/materials/materialInterface"
import dbWorker from "../dbWorker/dbWorker"

export default async function get_all_materials(): Promise<MaterialInterface[]> {
    return new Promise((resolve) => {
        dbWorker(
            "SELECT * FROM materials",
            [],
            function (err, result: any[]) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#s4nj53md",
                                error: err,
                                // values: { leadId }
                            }, null, 2),
                        "5050441344"
                    )
                    resolve([])
                }
                if (!result?.length) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#m3kdb6d",
                                error: "Запросили заказ, которого нет",
                                // values: { leadId }
                            }, null, 2),
                        "5050441344"
                    )
                    resolve([])
                } else {
                    resolve(result)
                }
            }
        )
    })
}