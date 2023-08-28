import { toast } from "react-toastify";

export async function getEmployeesByLeadId(leadId: number): Promise<Employee[]> {
    return await fetch(
        `/api/employees/get/with_lead_rights/${leadId}`,
        {method:"POST"}
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
            console.log('res', res);
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
                            err: "#ncn3ndf4v",
                            data: {
                                statusText,
                                values: leadId
                            }
                        }
                    })
                }
            )
                .then(x => x.json())
                .then(x => {
                    console.log(x);
                })
            return null;
        })
}




export interface Employee {
    role: null | string
    user_id: number
    username: string
}