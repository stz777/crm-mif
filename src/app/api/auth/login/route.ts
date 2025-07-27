import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";
import { sendMessageToTg } from "../../bugReport/sendMessageToTg";
import { Employee } from "@/app/components/types/employee";
// import dbWorker from "@/app/db/dbWorker/dbWorker";
import generateRandomString from "../confirm/generateRandomString";
import dbWorker from "@/app/db/dbWorker/dbWorker2";
import insertTokenToDB from "../confirm/insertTokenToDB";

export async function POST(
  request: Request,
) {
  const resquestData = await request.json();


  const user = await dbWorker(`
    SELECT
      id, username
    FROM employees
    WHERE
      telegram_id = ?
      and password = ?
      AND is_active = 1
  `, [resquestData.login, resquestData.password]).then(x => x.result).then(x => x[0]);

  if (!user) {
    return NextResponse.json({
      success: false,
      error: "#mnfdj8dhsK"
    });
  }

  console.log({ user });

  const token = generateRandomString();

  const res = await insertTokenToDB(token, user.id)

  // console.log({ token, res });

  if (res) {
    return NextResponse.json({
      success: true,
      token: token,
      user: user.username,
    });
  }

  // const user = await getUserByTg(resquestData.login, resquestData.password);
  // console.log(user);

  // if (!user) {
  //   return NextResponse.json({
  //     success: false,
  //     error: "#mnfdj8dhsK"
  //   });
  // }

  // const token = generateRandomString();

  // console.log(token);



  // if (resquestData.login) {
  //     const employee = await getUserByTg(resquestData);

  //     if (employee) {
  //         const randomNumber = getRandomNumber(1000, 9999);
  //         const updated = await insertCodeToDb(randomNumber, employee.tg_chat_id);
  //         if (updated) {
  //             sendMessageToTg(
  //                 `Код доступа ${randomNumber}`,
  //                 String(employee.tg_chat_id)
  //             )
  //             return NextResponse.json({
  //                 success: true,
  //                 error: "#dmsdidnneb"
  //             });
  //         } else {
  //             return NextResponse.json({
  //                 success: false,
  //                 error: "#sndjdgJnb"
  //             });
  //         }
  //     } else {
  //         sendMessageToTg(
  //             JSON.stringify({
  //                 'title': `Незарегистрированный пользователь прорывается в систему`,
  //                 data: resquestData
  //             }, null, 2),
  //             "5050441344"
  //         )
  //         return NextResponse.json({
  //             success: false,
  //             error: "#dndmdjsU"
  //         });
  //     }
  // }
  return NextResponse.json({
    success: false,
    error: "#mnfdj8dhsK"
  });
}

// async function getUserByTg(login: string, password: string): Promise<Employee | null> {
//   return await new Promise(resolve => {
//     dbWorker(
//       "SELECT id FROM employees WHERE telegram_id = ? AND is_active = 1",
//       [login,
//         password],
//       function (err, res: any) {
//         console.log(res);

//         const employee = res?.pop();
//         if (employee) {
//           resolve(employee)
//         } else {
//           resolve(null)
//         }
//       }
//     )
//   })
// }

// async function insertCodeToDb(code: number, tg_chat_id: number) {
//   return await new Promise(resolve => {
//     dbWorker(
//       "UPDATE employees SET password = ? WHERE tg_chat_id = ?",
//       [String(code), String(tg_chat_id)],
//       function (err, res: any) {
//         if (err) {
//           sendMessageToTg(
//             JSON.stringify(
//               {
//                 errorNo: "#cndm3n5b7J",
//                 error: err,
//                 values: { code, tg_chat_id }
//               }, null, 2),
//             "5050441344"
//           )
//         }
//         resolve(res?.changedRows);
//       }
//     )
//   })
// }

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}