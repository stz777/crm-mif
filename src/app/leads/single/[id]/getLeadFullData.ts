import getClentMeta from "@/app/db/clients/getClentMeta";
import { getPaymentsByLeadId } from "@/app/db/payments_by_lead/getPaymentsByLeadId";
import getExpensesByLeadId from "../../get/getExpensesByLeadId";
import getClientByLeadId from "./getClientByLeadId";
import getEmployeesByLeadId from "./getEmployeesByLeadId";
import getLead from "./getLead";
import getMessagesByLeadId from "./getMessagesByLeadId";

export default async function getLeadFullData(lead_id: number) {

    const lead = await getLead(lead_id);
    const employees = await getEmployeesByLeadId(lead_id);
    const messages = await getMessagesByLeadId(lead_id);
    const payments = await getPaymentsByLeadId(lead_id);
    const expenses = await getExpensesByLeadId(lead_id);
    const client = await getClientByLeadId(Number(lead_id));
    const clientMeta = await getClentMeta(Number(client?.id));

    if (!lead) return null;

    return {
        lead,
        employees,
        messages,
        payments,
        expenses,
        client,
        clientMeta,
    }

} 