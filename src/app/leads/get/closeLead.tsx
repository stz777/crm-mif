"use client"

import { toast } from "react-toastify";

export default function CloseLead({ leadId }: { leadId: number }) {
    return <><button
        className="btn btn-sm btn-outline-danger text-nowrap"
        onClick={() => {
            fetch(
                `/api/leads/close/${leadId}`,
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
            ).then(data => {
                if (data.success) {
                    toast.success("Заказ закрыт");
                    // resetForm();
                } else {
                    toast.error("Что-то пошло не так");
                }
            })
                .catch(error => {
                    toast.error("Что-то пошло не так");
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
                                    err: "#fmm3nd9vnk2J",
                                    data: {
                                        statusText,
                                        values: {leadId}
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
        }}
    >Закрыть заказ</button></>
}

