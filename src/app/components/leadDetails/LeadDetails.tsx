import { LeadInterface } from "@/app/components/types/lead";
import dayjs from "dayjs";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaRubleSign, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { PaymentWithEmployeeAndCheck } from "@/types/payments/PaymentWithEmployeeAndCheck";
import Comment from "@/app/leads/get/Comment";
import Phone from "@/app/leads/get/Phone";
import Urgency from "@/app/leads/get/Urgency";
import paymentsReducer from "@/app/leads/get/paymentsReducer";

export default function LeadDetails(props: { lead: LeadInterface }) {
    return <>
        <div className="d-flex align-items-center border-bottom px-4 py-3 ">
            <div className="h3">Детали заказа</div>
            <span className="ms-3 text-secondary" style={{ fontSize: "0.8em" }}>ID: {props.lead.id}</span>
        </div>
        <div className="px-4">
            <div>
                <Wrapper title="Описание">
                    {props.lead.description}
                </Wrapper>
                <Wrapper title="Статус">
                    <Comment currentText={props.lead.comment} lead_id={props.lead.id} />
                </Wrapper>
                <Wrapper title="Дата создания">
                    {dayjs(props.lead.created_date).format("DD.MM.YYYY")}
                </Wrapper>
                <Wrapper title="Дедлайн">
                    <div className="d-flex">
                        <div className="me-3">{dayjs(props.lead.deadline).format("DD.MM.YYYY")}</div>
                        <Urgency deadline={props.lead.deadline} done_at={props.lead.done_at} />
                    </div>
                </Wrapper>
                <Wrapper title="Ответственные">
                    {props.lead.employees.map((employee, i) =>
                        <div key={employee.id} className={`${i ? "mb-2" : ""}`}>{employee.username}</div>
                    )}
                </Wrapper>
                <div className="border-bottom my-3"></div>
                <h4>Клиент</h4>
                <Wrapper title="Имя">
                    {props.lead.clientData.full_name}
                </Wrapper>
                <Wrapper title="WhatsApp">
                    <Phone phone={String(props.lead.clientData.meta.find(item => item.data_type === "phone")?.data)} />
                </Wrapper>
                <div className="border-bottom my-3"></div>
                <h4>Оплата</h4>
                <Wrapper title="Сумма заказа"><strong>{props.lead.sum}</strong> <FaRubleSign /></Wrapper>
                <Wrapper title="Оплачено"><strong>{paymentsReducer(props.lead.payments || [])}</strong> <FaRubleSign /></Wrapper>
                <PaymentForm leadId={props.lead.id} />
                <div className="border-bottom my-3"></div>
                <h4>Чеки</h4>
                <PaymentChecksViewer lead_id={props.lead.id} />
            </div>
        </div>
    </>
}


function PaymentChecksViewer(props: { lead_id: number }) {
    const [payments, setPayments] = useState<PaymentWithEmployeeAndCheck[]>([]);
    const [path, setPath] = useState("");
    useEffect(() => {
        (async function req() {
            console.log('updated');

            const { path, payments } = await getPayments(props.lead_id)
            setPayments(payments);
            setPath(path);
            await new Promise(r => {
                setTimeout(async () => {
                    req();
                    r(true);
                }, 3000);
            })
        })()
    }, [])
    return <>
        <table className="table">
            <tbody>
                {payments.map(payment => <tr key={payment.id}>
                    <td>{payment.employee.username}</td>
                    <td>{payment.sum}</td>
                    <td className="text-end">{(payment.check?.file_name) ?
                        <a target="blank" href={"/images//" + payment.check.file_name}>чек</a>
                        : "нет чека"}</td>
                </tr>)}
            </tbody>
        </table>
    </>
}

async function getPayments(lead_id: number): Promise<{ success: boolean, payments: PaymentWithEmployeeAndCheck[], path: string }> {
    return fetch(`/api/payments/get-payment-checks-by-lead-id/${lead_id}`)
        .then(x => x.json())
        .then((x: any) => x)
}


function PaymentForm(props: { leadId: number }) {
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

function Wrapper(props: {
    title: string;
    children: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined;
}) {
    return <>
        <div className="d-flex mb-3">
            <div style={{ width: 220 }}>{props.title}</div>
            <div>{props.children}</div>
        </div>
    </>
}