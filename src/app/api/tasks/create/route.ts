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
  comment: string;
}) {
  return pool
    .promise()
    .query("insert into tasks (deadline,description, manager, comment) values (?,?,?,?)", [
      props.deadline,
      props.description,
      props.manager,
      props.comment,
    ])
    .then(([x]: any) => {
      return x.insertId;
    })
    .catch((error) => {
      console.error("err #fkfrjj", error);
      return 0;
    });
}