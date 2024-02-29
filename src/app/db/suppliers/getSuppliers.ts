import { SupplierInterface } from "@/app/components/types/supplierInterface";
import { pool } from "../connect";

export default async function getSuppliers(): Promise<SupplierInterface[]> {
  return pool
    .promise()
    .query("SELECT * FROM suppliers")
    .then(([x]: any) => {
      return x;
    })
    .catch((error) => {
      console.error("error #c947", error);
      return [];
    });
}
