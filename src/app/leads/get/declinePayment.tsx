"use client"

import { toast } from "react-toastify";

export default function DeclinePayment({ paymentId }: { paymentId: number }) {
    return <><button
        className="btn btn-sm btn-outline-danger me-2"
        onClick={() => {
            fetch(
                `/api/payments/decline/${paymentId}`,
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
                    toast.success("Оплата отменена");
                    // resetForm();
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
                                    err: "#fsck3m3m",
                                    data: {
                                        statusText,
                                        values: paymentId
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
    >Отменить</button></>
}