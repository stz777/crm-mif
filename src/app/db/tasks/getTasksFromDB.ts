import { SearchInterface, TaskFromDBInterface } from "@/types/tasks/task";
import { pool } from "../connect";

export default async function getTasksFromDB(
  searchParams: SearchInterface
): Promise<TaskFromDBInterface[]> {
  let whereArr = [];

  if (searchParams.is_archive) {
    whereArr.push(`T.done_at is not null`);
  } else {
    whereArr.push(`T.done_at is null`);
  }

  if (/^[0-9]+$/.test(String(searchParams?.keyword))) {
    whereArr.push(`T.id = ${searchParams.keyword}`);
  } else {
    if (searchParams.keyword)
      whereArr.push(`T.description like "%${searchParams.keyword}%"`);
  }

  const whereStr = whereArr.length ? " WHERE " + whereArr.join(" AND ") : "";


  return pool
    .promise()
    .query(
      `select 
  T.*, E.username as managerName
from tasks as T
left join employees as E on E.id = T.manager
${whereStr}
order by T.id desc`
    )
    .then(([x]: any) => x)
    .catch((error) => {
      console.error("err #fmfnd77", error);
      return [];
    });
}
