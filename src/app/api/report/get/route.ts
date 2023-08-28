// import { pool } from "@/app/db/connect";
import { getUserByToken } from "@/app/components/getUserByToken";
import getFinReportdata from "@/app/fin_report/getFinReportdata";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
// import { sendMessageToTg } from "../../bugReport/sendMessageToTg";

export async function POST(
    request: Request,
) {


    const auth = cookies().get('auth');
    if (!auth?.value) return new Response("Кто ты", { status: 401, });;
    const user = await getUserByToken(auth?.value);
    if (!user) return new Response("Кто ты", { status: 401, });;
    if (!user.is_boss) return new Response("Кто ты", { status: 401, });;


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