// import { pool } from "@/app/db/connect";
import getFinReportdata from "@/app/fin_report/getFinReportdata";
import { NextResponse } from "next/server";
// import { sendMessageToTg } from "../../bugReport/sendMessageToTg";

export async function GET(
    request: Request,
) {

    const reportData = await getFinReportdata();

    return NextResponse.json({
        success: true,
        reportData
    });

    // const data = await request.json();
    // const { name, contacts } = data;

    // const success = await new Promise(resolve => {
    //     pool.query(
    //         `INSERT INTO suppliers (name, contacts ) VALUES (?,?)`,
    //         [name, contacts],
    //         function (err, res: any) {
    //             if (err) {
    //                 sendMessageToTg(
    //                     JSON.stringify(
    //                         {
    //                             errorNo: "#djaScsdasund",
    //                             error: err,
    //                             values: { name, contacts }
    //                         }, null, 2),
    //                     "5050441344"
    //                 )
    //             }
    //             resolve(Number(res?.insertId));
    //         }
    //     );
    // });

    // if (success) {
    //     return NextResponse.json({
    //         success: true,
    //     });

    // } else {
    //     return NextResponse.json({
    //         success: false,
    //     });
    // }

}