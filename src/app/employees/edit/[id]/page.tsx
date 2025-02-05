import { Employee, EmployeeMeta } from "@/app/components/types/employee";
import EditEmployeeForm from "./editEmployeeForm";
import { pool } from "@/app/db/connect";
import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { getUserByToken } from "@/app/components/getUserByToken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import dbWorker from "@/app/db/dbWorker/dbWorker";

export default async function Page({ params }: { params: { id: number } }) {
  const auth = cookies().get("auth");
  if (!auth?.value) return redirect("/");
  const user = await getUserByToken(auth?.value);
  if (!user) return redirect("/");
  if (!user.is_boss) return redirect("/");

  const { id } = params;
  const employee = await getEmployeeById(id);
  const enployeeMeta = await getEmployeeMeta(id);
  return (
    <>
      <h1>Редактирование сотрудника</h1>
      <EditEmployeeForm employee={employee} employeeMeta={enployeeMeta} />
    </>
  );
}

async function getEmployeeById(id: number): Promise<Employee> {
  // TODO удалить функции дубли
  const employees: Employee = await new Promise((resolve) => {
    dbWorker(
      "SELECT id, username, telegram_id, tg_chat_id, is_manager, is_active FROM employees WHERE id= ?",
      [id],
      function (err: any, res: any) {
        if (err) {
          sendMessageToTg(
            JSON.stringify(
              {
                errorNo: "#dmsn*sfl",
                error: err,
                values: {},
              },
              null,
              2
            ),
            "5050441344"
          );
        }
        if (!res?.length) {
          sendMessageToTg(
            JSON.stringify(
              {
                errorNo: "#dmsDkKsfl",
                error: "Запросили сотрудника, которого нет в базе",
                values: {},
              },
              null,
              2
            ),
            "5050441344"
          );
        }
        resolve(res.pop());
      }
    );
  });

  return employees;
}

async function getEmployeeMeta(employeeId: number): Promise<EmployeeMeta[]> {
  const employees: EmployeeMeta[] = await new Promise((resolve, reject) => {
    dbWorker(
      "SELECT * FROM employees_meta WHERE employee_id = ?",
      [employeeId],
      function (err: any, res: any) {
        if (err) {
          sendMessageToTg(
            JSON.stringify(
              {
                errorNo: "#dnsad3J8",
                error: err,
                values: { employeeId },
              },
              null,
              2
            ),
            "5050441344"
          );
          reject(false);
        }
        if (res) {
          resolve(res);
        }
      }
    );
  });
  return employees;
}
