import { pool } from "@/app/db/connect";
import { sendMessageToTg } from "@/app/api/bugReport/sendMessageToTg";
import { LeadInterface, PaymentInterface } from "@/app/components/types/lead";
import getExpensesByLeadId from "../../db/leads/getLeadFullData/getExpensesByLeadId";
import { getUserByToken } from "@/app/components/getUserByToken";
import { cookies } from "next/headers";
import getClientByLeadId from "@/app/db/leads/getLeadFullData/getClientByLeadId";
import { getPaymentsByLeadId } from "./getPaymentsByLeadId";
import { getRoleByLeadId } from "./getRoleByLeadId";
import getEmployeesByLeadId from "@/app/db/leads/getLeadFullData/getEmployeesByLeadId";

interface SearchParametersInterface {
  id?: number;
  client?: number;
  is_archive?: "true" | boolean;
  keyword: string;
}

export async function getLeads(
  searchParams?: SearchParametersInterface
): Promise<LeadInterface[]> {
  const auth = cookies().get("auth");
  if (!auth?.value) return [];
  const user = await getUserByToken(auth?.value);
  if (!user) return [];

  const whereArr: string[] = [];

  const whereParams: string[] = [];

  // console.log("searchParams dkd99", searchParams);

  const ids = [];

  if (searchParams?.keyword) {
    if (/[0-9]+/.test(searchParams.keyword)) {
      ids.push(searchParams.keyword);
      ids.push(...(await getLeadsByPhoneInserts(searchParams.keyword)));
    }
    if (/[а-яА-Я ]+/.test(searchParams.keyword)) {
      ids.push(...(await getLeadsByClientName(searchParams.keyword)));
    }
  }
  if (searchParams?.id) {
    whereParams.push(`id = ${searchParams.id}`);
  }

  if (ids.length) {
    whereArr.push(`id IN (${ids})`);
  }

  whereArr.push(...whereParams);

  if (searchParams?.client) {
    whereArr.push(`client = ${searchParams.client}`);
  }
  if (searchParams?.is_archive) {
    whereArr.push(`done_at IS NOT NULL`);
  } else {
    whereArr.push(`done_at IS NULL`);
  }

  const whereString = whereArr.length ? "WHERE " + whereArr.join(" AND ") : "";


  const qs = `SELECT * FROM leads ${whereString}  ORDER BY id DESC `;

  const leads: LeadInterface[] = await pool
    .promise()
    .query(qs)
    .then(([leads]: any) => leads)
    .catch((error: any) => {
      console.error("err £fjf0f9", error);
      return [];
    });

  const output = [];

  for (let index = 0; index < leads.length; index++) {
    const { id: leadId } = leads[index];
    const role = await getRoleByLeadId(leadId);

    if (role) {
      output.push({
        ...leads[index],
        payments: await getPaymentsByLeadId(leadId),
        expensesPerLead: await getExpensesByLeadId(leadId),
        clientData: await getClientByLeadId(leadId),
        employees: await getEmployeesByLeadId(leadId),
      });
    }
  }

  return output;
}

async function getLeadsByPhoneInserts(phone: string): Promise<number[]> {
  return pool
    .promise()
    .query(
      `SELECT * FROM leads WHERE client IN (
        SELECT client FROM clients_meta WHERE data_type = 'phone' AND data LIKE ? 
      )`,
      [`%${phone}%`]
    )
    .then(([x]: any) => {
      return x.map((client: any) => client.id);
    })
    .catch((error: any) => {
      console.log("error £f9f6", error);
    });
}

async function getLeadsByClientName(name: string): Promise<number[]> {
  return pool
    .promise()
    .query(
      `SELECT * FROM leads WHERE client IN (
        SELECT id FROM clients WHERE full_name LIKE ? 
      )`,
      [`%${name}%`]
    )
    .then(([x]: any) => {
      return x.map((client: any) => client.id);
    })
    .catch((error: any) => {
      console.log("error £f933f6", error);
    });
}
