import { toast } from "react-toastify";

export async function getEmployeesByTaskId(task_id: number): Promise<Employee[]> {
    return await fetch(
        `/api/employees/get/with_purchase_task_rights/${task_id}`,
        {
            method:"POST"
        }
    ).then(
        response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error(response.statusText);
            }
        }
    ).then(res => {
        if (res.success) {
            return res.data;
        } else {
            toast.error("Что-то пошло не так");
        }
    })
        .catch(error => {
            const statusText = String(error);
            fetch(
                `/api/bugReport`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        text: {
                            err: "#ndJs9yHd",
                            data: {
                                statusText,
                                values: task_id
                            }
                        }
                    })
                }
            )
                .then(x => x.json())
            return null;
        })
}



export interface Employee {
    role: null | string
    user_id: number
    username: string
}