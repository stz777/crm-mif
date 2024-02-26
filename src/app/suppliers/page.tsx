import { SupplierInterface } from "../components/types/supplierInterface";
import { pool } from "../db/connect";
import PageTmp from "../ui/tmp/page/PageTmp";
import CreateSupplier from "./CreateSupplier";
import Client from "./client";

export default async function Page() {
    const suppliers = await getSuppliers();
    return <>
        <PageTmp title={"Поставщики"} filter={<CreateSupplier />} >
            <Client suppliers={suppliers} />
        </PageTmp>
    </>
}

async function getSuppliers(): Promise<SupplierInterface[]> {
    return pool.promise().query(
        "SELECT * FROM suppliers"
    )
        .then(([x]: any) => {
            return x;
        })
        .catch(error => {
            console.error('error #c947', error);
            return [];
        })

}