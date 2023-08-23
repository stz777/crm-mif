export interface Employee {
    id: number
    username: string
    telegram_id: string
    tg_chat_id: number
    meta?: EmployeeMeta[]
    leads?: any[]
    is_manager: boolean | 1 | 0
    is_active: boolean | 1 | 0
}

export interface EmployeeMeta {
    id: number
    data_type: string
    data: string
}