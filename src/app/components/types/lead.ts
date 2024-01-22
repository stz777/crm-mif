import { ClientInterface } from "./clients"
import { Employee } from "./employee"

export interface LeadInterface {
    id: number
    client: string
    description: string
    created_date: string
    deadline: string
    done_at: string | null
    comment: string
    sum: number
    payments?: PaymentInterface[]
    clientData: ClientInterface
    employees: Employee[]
}

export interface PaymentInterface {
    id: number
    lead: number
    done_by: number
    created_date: string
    confirmed: boolean
    sum: number
}
