export interface LeadInterface {
    id: number
    client: string
    description: string
    created_date: string
    deadline: string
    done_at: string | null
    sum: number
    payments?: PaymentInterface[]
}

export interface PaymentInterface {
    id: number
    lead: number
    done_by: number
    created_date: string
    confirmed: boolean
    sum: number
}
