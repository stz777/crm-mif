export interface PurchaseInterface {
    id: number
    purchase_task: number
    sum: number
    comment: string
    materials: number
    created_date: string
    material_name?: string
}