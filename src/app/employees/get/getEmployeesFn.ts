import { sendMessageToTg } from "@/app/api/bugReport/route";
import { pool } from "@/app/db/connect";

export async function getEmployees(): Promise<Employee[]> {
    const employees: Employee[] = await new Promise((resolve, reject) => {
        pool.query("SELECT id, username, telegram_id, tg_chat_id FROM employees",
            function (err: any, res: Employee[]) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#c04kfu6b",
                                error: err,
                                values: {}
                            }, null, 2),
                        "5050441344"
                    )
                }
                resolve(res);
            }
        )
    });

    for (let index = 0; index < employees.length; index++) {
        const { id: employeeId } = employees[index];
        employees[index].meta = await getEmployeeMeta(employeeId);
    }

    return employees;

}

async function getEmployeeMeta(employeeId: number): Promise<EmployeeMeta[]> {
    const employees: EmployeeMeta[] = await new Promise((resolve, reject) => {
        pool.query("SELECT * FROM employees_meta",
            function (err: any, res: EmployeeMeta[]) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#nd83nkd",
                                error: err,
                                values: { employeeId }
                            }, null, 2),
                        "5050441344"
                    )
                    reject(false);
                }
                if (res) {
                    resolve(res);
                }
            }
        )
    });

    return employees;

}


interface Employee {
    id: number
    username: string
    telegram_id: string
    meta?: EmployeeMeta[]
    tg_chat_id: number
}

interface EmployeeMeta {
    id: number
    data_type: string
    data: string
}