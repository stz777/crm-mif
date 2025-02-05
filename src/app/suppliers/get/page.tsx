import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { getUserByToken } from "@/app/components/getUserByToken";
import { SupplierInterface } from "@/app/components/types/supplierInterface";
import { pool } from "@/app/db/connect";
import dbWorker from "@/app/db/dbWorker/dbWorker";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  const auth = cookies().get("auth");
  if (!auth?.value) return redirect("/");
  const user = await getUserByToken(auth?.value);
  if (!user) return redirect("/");
  if (!user.is_manager) return redirect("/");
  const suppliers = await getSuppliers();
  return (
    <>
      <h1>Поставщики</h1>
      <table className="table table-bordered table-striped w-auto">
        <thead>
          <tr className="sticky-top">
            <th>номер</th>
            <th>Наименование</th>
            <th>Контакты</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier, i) => (
            <tr key={supplier.id}>
              <td>
                <Link href={`/suppliers/single/${supplier.id}`}>
                  Поставщик #{supplier.id}
                </Link>
              </td>
              <td>{supplier.name}</td>
              <td>
                <pre style={{ font: "initial" }} className="m-0 p-0">
                  {supplier.contacts}
                </pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

async function getSuppliers(): Promise<SupplierInterface[]> {
  return await new Promise((r) => {
    dbWorker(
      "SELECT * FROM suppliers",
      [],
      function (err: any, res: SupplierInterface[]) {
        if (err) {
          sendMessageToTg(
            JSON.stringify(
              {
                errorNo: "#ndsj3Jjd",
                error: err,
                values: {},
              },
              null,
              2
            ),
            "5050441344"
          );
        }
        r(res ? res : []);
      }
    );
  });
}
