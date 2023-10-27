import EmployeesCombinedInterface from "@/app/leads/single/[id]/EmployeesCombinedInterface";
import { ClientInterface, ClientMetaInterface } from "./clients";
import { LeadInterface, PaymentInterface, ExpensesPerLeadInterface } from "./lead";
import { MessageInterface, Media } from "./messages";

export type MessageToLead = MessageInterface & {
    username: string;
    role: string;
    attachments: Media[]
};


export type LeadFullDatInterface = {
    lead: LeadInterface;
    employees: EmployeesCombinedInterface[];
    client: ClientInterface | null;
    clientMeta: ClientMetaInterface[];
    payments: PaymentInterface[];
    expenses: ExpensesPerLeadInterface[];
    messages: MessageToLead[];
}
