import { Employee } from "./employee"

export interface MessageInterface {
    id: number
    created_date: string
    essense: string
    essense_id: number
    sender: number
    text: string
}

export interface Media {
    id: number
    name: string
}

export interface EmployeeRoleInEssense {
    role: string
}

export interface MessageForChatInterface {
    message: MessageInterface
    media: Media[]
    employee: Employee
    employeeRoleInEssense: EmployeeRoleInEssense
}