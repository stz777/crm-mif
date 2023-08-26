import { toast } from "react-toastify";

export async function getEmployeesByProjectId(project_id: number): Promise<Employee[]> {
    return await fetch(
        `/api/employees/get/with_project_rights/${project_id}`,
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
                            err: "#dmasnH7",
                            data: {
                                statusText,
                                values: project_id
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