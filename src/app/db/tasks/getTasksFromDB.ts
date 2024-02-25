import { TaskFromDBInterface } from "@/types/tasks/task";
import { pool } from "../connect";

export default async function getTasksFromDB(): Promise<TaskFromDBInterface[]> {
  return pool
    .promise()
    .query("select * from tasks order by id desc")
    .then(([x]: any) => x)
    .catch((error) => {
      console.error("err #fmfnd77", error);
      return [];
    });
}
