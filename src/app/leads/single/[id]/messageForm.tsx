"use client"
import FieldWrapper from "@/app/ui/form/fieldWrapper"
import { useForm, SubmitHandler } from "react-hook-form"
import { FaChevronCircleRight } from "react-icons/fa"
import { toast } from "react-toastify"
export default function MessageForm({ leadId }: { leadId: number }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset

    } = useForm<Inputs>({
        defaultValues: {
            essense: "lead",
            essense_id: leadId
        }
    })
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        // reset();
        sendMessage(data);
    }

    return (
        <div className="card" style={{ maxWidth: "500px" }}>
            <div className="card-body bg-secondary">
                <form className="">
                    <div className="d-flex align-items-end">
                        <textarea {...register("text", { required: true })} placeholder="Введите сообщение" className="form-control" />
                        <FaChevronCircleRight onClick={handleSubmit(onSubmit)} size={25} className="ms-2" />
                    </div>
                </form>
            </div>
        </div>
    )
}


async function sendMessage(data: any) {
    console.log(data);
    const formdata = new FormData();
    formdata.append("text", data.text);

    formdata.append("essense", data.essense);
    formdata.append("essense_id", data.essense_id);
    fetch(
        "/api/message/send",
        {
            method: "POST",
            body: formdata
        }
    )
        .then(
            response => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw new Error(response.statusText);
                }
            }
        ).then((data) => {
            if (data.success) {
                toast.success("Сообщение отправлено");
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
                            err: "#admck3jm",
                            data: {
                                statusText,
                                values: data
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



type Inputs = {
    text: string
    essense: string
    essense_id: number
    images: any[]
}
