import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
import { sendBugReport } from "../../bugReport/route";

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
                sendBugReport(
                    JSON.stringify(
                        {
                            errorNo: "#fdsln4bd8d8d",
                            error: err,
                            values: { client, description, title, deadline }
                        }, null, 2),
                    "5050441344"
                )
            }
        }
    );

    return NextResponse.json({
        success: true,
    });
}