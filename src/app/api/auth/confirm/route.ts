import { NextResponse } from "next/server";
import insertCodeToDb from "./insertCodeToDb";
import generateRandomString from "./generateRandomString";
import getUserByCode from "./getUserByCode";

export async function POST(
    request: Request,
) {
    const resquestData = await request.json();
    if (resquestData.code) {
        const user: any = await getUserByCode(resquestData.code);
        if (user) {
            const newToken = generateRandomString();
            const updated = await insertCodeToDb(newToken, user.id);
            if (updated) {
                return NextResponse.json({
                    success: true,
                    token: newToken,
                    user:user.username,
                });
            } else {
                return NextResponse.json({
                    success: false,
                });
            }
        } else {
            return NextResponse.json({
                success: false,
            });
        }
    }
    return NextResponse.json({
        success: false,
    });
}

