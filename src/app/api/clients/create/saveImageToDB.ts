import { pool } from "@/app/db/connect"
import { sendMessageToTg } from "../../bugReport/sendMessageToTg"

export default async function saveImageToDB(imageName: string, messageId: number) {
    return new Promise((resolve) => {
        pool.query(
            "INSERT INTO media (message, is_image, name) VALUES(?,?,?)",
            [messageId, 1, imageName],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#md8ch3nmkx9",
                                error: err,
                                values: {
                                    imageName,
                                    messageId
                                }
                            }, null, 2),
                        "5050441344"
                    )
                    resolve(null)
                }
                if (res.insertId) {
                    resolve(res.insertId)
                } else {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#dn2nnfls",
                                error: "Хуйня какая-то произошла",
                                values: {
                                    imageName,
                                    messageId
                                }
                            }, null, 2),
                        "5050441344"
                    )
                }
            }
        )
    })
}
