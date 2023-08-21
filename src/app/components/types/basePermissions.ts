export interface BasePermissions {
    createEmployees: Bool
    viewEmployees: Bool
    createClient: Bool
    createOrders: Bool
    viewOrders: Bool
    viewFinReport: Bool
}

type Bool = boolean | "1" | "0"