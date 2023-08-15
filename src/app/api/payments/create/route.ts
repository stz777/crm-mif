import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";

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
                console.log('err #ckdjn3m3n3oe', err);
            }
            console.log('res', res);
        }
    );

    return NextResponse.json({
        success: true,
    });

}