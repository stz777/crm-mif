import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { pool } from "@/app/db/connect";

export async function getEmployees(): Promise<Employee[]> {
    const employees: Employee[] = await new Promise((resolve, reject) => {
        pool.getConnection(function (err, conn) {
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
            pool.releaseConnection(conn);
        })
    });

    for (let index = 0; index < employees.length; index++) {
        const { id: employeeId } = employees[index];
        employees[index].meta = await getEmployeeMeta(employeeId);
    }

    for (let index = 0; index < employees.length; index++) {
        const { id: employeeId } = employees[index];
        employees[index].leads = await getLeadsPerEmployeeId(employeeId);
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

async function getLeadsPerEmployeeId(employeeId: number): Promise<any[]> {
    return await new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM leads_roles WHERE user = ${employeeId}`,
            function (err: any, res: EmployeeMeta[]) {
                if (err) {
                    sendMessageToTg(
                        JSON.stringify(
                            {
                                errorNo: "#nf93nfkvfv6s",
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
}


interface Employee {
    id: number
    username: string
    telegram_id: string
    tg_chat_id: number
    meta?: EmployeeMeta[]
    leads?: any[]
}

interface EmployeeMeta {
    id: number
    data_type: string
    data: string
}