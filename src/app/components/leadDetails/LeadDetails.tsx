import { LeadInterface } from "@/app/components/types/lead";
import dayjs from "dayjs";
import { FaRubleSign } from "react-icons/fa";
import Comment from "@/app/leads/get/Comment";
import Phone from "@/app/leads/get/Phone";
import Urgency from "@/app/leads/get/Urgency";
import paymentsReducer from "@/app/leads/get/paymentsReducer";
import PaymentChecksViewer from "./components/PaymentChecksViewer";
import PaymentForm from "./components/PaymentForm";
import Wrapper from "./components/Wrapper";
import EmployeesController from "./components/EmployeesController";
import { toast } from "react-toastify";

export default function LeadDetails(props: { lead: LeadInterface }) {
    return <>
        <div className="d-flex align-items-center border-bottom px-4 py-3 ">
            <div className="h3">Детали заказа</div>
            <span className="ms-3 text-secondary" style={{ fontSize: "0.9em" }}>ID: {props.lead.id}</span>
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
                {props.lead.done_at && <Wrapper title="Закрыт">
                    <div className="d-flex">
                        <div className="me-3">{dayjs(props.lead.done_at).format("DD.MM.YYYY")}</div>
                    </div>
                </Wrapper>}
                <EmployeesController default_employees={props.lead.employees} lead_id={props.lead.id} />
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
                {!props.lead.done_at && <PaymentForm leadId={props.lead.id} />}
                <div className="border-bottom my-3"></div>
                <h4>Чеки</h4>
                <PaymentChecksViewer lead_id={props.lead.id} />
                {!props.lead.done_at ? <CloseLead lead_id={props.lead.id} /> : <ReturnLead lead_id={props.lead.id} />}
            </div>
        </div>
    </>
}

function CloseLead(props: { lead_id: number }) {
    return <>
        <button className="btn btn-outline-success" onClick={() => {
            fetch(
                `/api/leads/close/${props.lead_id}`,
                {
                    method: "POST"
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
                } else {
                    toast.error("Что-то пошло не так #lf944");
                }
            })
                .catch(error => {
                    toast.error("Что-то пошло не так #f0f83");
                })
        }}>Закрыть заказ</button>
    </>
}

function ReturnLead(props: { lead_id: number }) {
    return <>
        <button className="btn btn-outline-success" onClick={() => {
            fetch(
                `/api/leads/return/${props.lead_id}`,
                {
                    method: "POST"
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
                    toast.success("Заказ восстановлен");
                } else {
                    toast.error("Что-то пошло не так #lf94d4");
                }
            })
                .catch(error => {
                    toast.error("Что-то пошло не так #f0fs83");
                })
        }}>Восстановить заказ</button>
    </>
}