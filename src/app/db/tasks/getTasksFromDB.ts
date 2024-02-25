import { TaskFromDBInterface } from "@/types/tasks/task";
import { pool } from "../connect";

export default async function getTasksFromDB(): Promise<TaskFromDBInterface[]> {
  return pool
    .promise()
    .query(
      `select 
  T.*, E.username as managerName
from tasks as T
left join employees as E on E.id = T.manager
order by id desc`
    )
    .then(([x]: any) => x)
    .catch((error) => {
      console.error("err #fmfnd77", error);
      return [];
    });
}
