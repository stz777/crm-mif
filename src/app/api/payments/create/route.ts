import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
import { sendBugReport } from "../../bugReport/route";

export async function POST(
    request: Request,
    { params }: { params: { id: number } }
) {

    const { lead_id, sum } = await request.json();

    pool.query(
        `INSERT INTO payments (lead_id, sum, done_by) VALUES (?,?,?)`,
        [lead_id, sum, 1],
        function (err, res) {
            if (err) {
                sendBugReport(
                    JSON.stringify(
                        {
                            errorNo: "#ckdjn3m3n3oe",
                            error: err,
                            values: { lead_id, sum  }
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