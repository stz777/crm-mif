import { toast } from "react-toastify";

export default async function fetchClients(searchParams: any) {
    return fetch(
        "/api/clients/get",
        {
            method: "POST",
            body: JSON.stringify(searchParams)
        }
    ).then(
        response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error(response.statusText);
            }
        }
    ).then(data => {
        if (data.success) {
            if (!data.clients) {
                toast.error("Что-то пошло не так #m3n7z");
            }
            return data;
        } else {
            toast.error("Что-то пошло не так #v8v7b");
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
                            err: "#c0c55",
                            data: {
                                statusText,
                                error,
                                values: {}
                            }
                        }
                    })
                }
            )
                .then(x => x.json())
                .then(x => {
                    console.log(x);
                })
        })
}