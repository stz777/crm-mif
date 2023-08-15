import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: { id: number } }
) {
    const { client, description, title, deadline } = await request.json();

    pool.query(
        `INSERT INTO leads (client, description, title, deadline) VALUES (?,?,?,?)`,
        [client, description, title, deadline],
        function (err, res) {
            if (err) {
                console.log('err #fdsln4bd8d8d', err);
            }
            console.log('res', res);
        }
    );

    return NextResponse.json({
        success: true,
    });
}