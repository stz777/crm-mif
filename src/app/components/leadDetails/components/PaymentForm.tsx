import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode } from "react";
import { useForm } from "react-hook-form";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import Wrapper from "./Wrapper";

export default function PaymentForm(props: { leadId: number }) {
    const { register, handleSubmit, reset, watch } = useForm<any>({
        defaultValues: {
            lead_id: props.leadId
        }
    })
    const inputValue: any = watch('image');
    // console.log('inputValue', inputValue?.length && inputValue[0]);

    return <div>
        <form onSubmit={handleSubmit((e: any) => onSubmit(e, reset))} className="mb-2">
            <div>
                <Wrapper title="Новая оплата">
                    <input {...register("sum", { required: true })} className="form-control" />
                </Wrapper>
                <Wrapper title="Чек">
                    <div>
                        {(inputValue?.length)
                            ? <>
                                <div className="mb-2">Прикреплен файл: {inputValue[0].name}</div>
                                <div onClick={() => {
                                    reset()
                                }} className="btn btn-sm btn-outline-danger">Отмена <FaTrash /></div>
                            </>
                            : <>
                                <input type="file" id="image" {...register("image")} className="d-none" />
                                <label htmlFor="image" className="btn btn-secondary">Выберите файл</label>
                            </>}
                    </div>
                </Wrapper>

            </div>
            <button className="btn btn-primary">Провести платеж</button>
        </form>
    </div>
}






const onSubmit = (data: any, resetForm: any) => {
    const formdata = new FormData();
    formdata.append("lead_id", data.lead_id);
    formdata.append("sum", data.sum);

    if (!data.sum) { toast.error('Некорректно заполнена форма'); return; }
    // if ((!data.image?.length) && !is_boss) {
    //     toast.error('Некорректно заполнена форма #err_sd3'); return;
    // }
    for (const key in data) {
        const element = data[key];
        if (key === "image") {
            for (let i = 0; i < element.length; i++) {
                formdata.append('image', element[i]);
            }
            continue;
        }

    }
    fetch(
        "/api/payments/create",
        {
            method: "POST",
            body: formdata
            // body: JSON.stringify(data)
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
            toast.success("Платеж проведен");
            resetForm();
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
                            err: "#admccKk3jm",
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
    console.log(data)
}
