import { pool } from "@/app/db/connect";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data: any = await request.json();
  const taskCreated = await insertTastkToDB(data);
  
  return NextResponse.json({
    success: !!taskCreated,
  });
}

async function insertTastkToDB(props: {
  description: string;
  manager: string;
  deadline: string;
}) {
  return pool
    .promise()
    .query("insert into tasks (deadline,description, manager) values (?,?,?)", [
      // `STR_TO_DATE('yourDateTimeValue','%d/%m/%Y %H:%i:%s')`,
      props.deadline,
      props.description,
      props.manager,
    ])
    .then(([x]: any) => {
      console.log("xxx", x);
      return x.insertId;
    })
    .catch((error) => {
      console.error("err #fkfrjj", error);
      return 0;
    });
  console.log({ props });
}

// id 	created_date 	deadline 	done_at 	description 	manager
