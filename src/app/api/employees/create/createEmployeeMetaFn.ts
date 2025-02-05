import { pool } from "@/app/db/connect";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";
import dbWorker from "@/app/db/dbWorker/dbWorker";

export default async function createEmployeeMetaFn({ employee, data_type, data }: EmployeeMetaType) {
    return await new Promise(r => {
        dbWorker(
            `INSERT INTO employees_meta ( employee_id, data_type, data) VALUES (?,?,?)`,
            [employee, data_type, data],
            function (err, res: any) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#sjcd8s3ndnc02",
                                error: err,
                                values: { employee, data_type, data }
                            }, null, 2),
                        "5050441344"
                    )
                }
                if (res)
                    r(res.insertId);
            })
    })
}

interface EmployeeMetaType {
    employee: number
    data_type: "phone" | "email"
    data: string
}