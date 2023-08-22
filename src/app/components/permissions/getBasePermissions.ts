import { BasePermissions } from "../types/basePermissions";

export default async function getBasePermissions(userID: number, isManager: boolean): Promise<BasePermissions> {
    const isBoss = [1, 2].includes(userID);
    return {
        createEmployees: isBoss,
        viewEmployees: isBoss,
        createClient: isBoss || isManager,
        createOrders: isBoss || isManager,
        viewOrders: isBoss || isManager,
        viewFinReport: isBoss,
    };
}