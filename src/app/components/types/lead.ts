export interface LeadInterface {
    id: number
    client: string
    description: string
    created_date: string
    deadline: string
    done_at: string | null
    sum: number
    payments?: PaymentInterface[]
    expensesPerLead?: ExpensesPerLeadInterface[]
    wait_pay: boolean | 0 | 1
    waiting_shipment: boolean | 0 | 1
}

export interface PaymentInterface {
    id: number
    lead: number
    done_by: number
    created_date: string
    confirmed: boolean
    sum: number
}

export interface ExpensesPerLeadInterface {
    id: number
    sum: number
    comment: string
    created_date: string
}

export interface ExpensesPePerPurchaseTaskInterface {
    id: number
    sum: number
    comment: string
    created_date: string
}