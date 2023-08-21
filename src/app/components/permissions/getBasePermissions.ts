import { BasePermissions } from "../types/basePermissions";

export default async function getBasePermissions(userID: number): Promise<BasePermissions> {
    const isBoss = [2].includes(userID);
    return {
        createEmployees: isBoss || false,
        viewEmployees: isBoss || false,
        createClient: isBoss || false,
    };
}