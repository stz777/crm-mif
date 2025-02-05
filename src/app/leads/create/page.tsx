import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { pool } from "@/app/db/connect";
import CreateLeadForm from "./createLeadForm";
import { getUserByToken } from "@/app/components/getUserByToken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ClientInterface } from "@/app/components/types/clients";
import dbWorker from "@/app/db/dbWorker/dbWorker";

export default async function Page() {
  const auth = cookies().get("auth");
  if (!auth?.value) return redirect("/");
  const user = await getUserByToken(auth?.value);
  if (!user) return redirect("/");
  if (!user.is_manager) return redirect("/");

  return (
    <>
      <h1>Создать заказ</h1>
      <CreateLeadForm is_boss={!!user.is_boss} />
    </>
  );
}

async function getClient(clientId: number): Promise<ClientInterface[]> {
  return await new Promise((r) => {
    dbWorker(
      "SELECT * FROM clients WHERE id = ?  ORDER BY id DESC",
      [clientId],
      function (err: any, res: any) {
        if (err) {
          sendMessageToTg(
            JSON.stringify(
              {
                errorNo: "#cmdn3n5b",
                error: err,
                values: {},
              },
              null,
              2
            ),
            "5050441344"
          );
        }
        r(res);
      }
    );
  });
}
