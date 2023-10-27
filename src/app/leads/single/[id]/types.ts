import { ClientInterface, ClientMetaInterface } from "@/app/components/types/clients";
import { LeadInterface, PaymentInterface, ExpensesPerLeadInterface } from "@/app/components/types/lead";
import { MessageInterface, Media } from "@/app/components/types/messages";
import EmployeesCombinedInterface from "./EmployeesCombinedInterface";

export type MessageToLead = MessageInterface & {
    username: string;
    role: string;
    attachments: Media[]
};


export type LeadFullDatInterface = {
    lead: LeadInterface;
    employees: EmployeesCombinedInterface[];
    is_boss: boolean;
    client: ClientInterface;
    clientMeta: ClientMetaInterface[];
    payments: PaymentInterface[];
    expenses: ExpensesPerLeadInterface[];
    messages: MessageToLead[];
}
