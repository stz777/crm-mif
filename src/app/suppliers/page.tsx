import getSuppliers from "../db/suppliers/getSuppliers";
import PageTmp from "../ui/tmp/page/PageTmp";
import CreateSupplier from "./CreateSupplier";
import Client from "./client/client";
import { SearchInterface } from "./types";

export default async function Page(props: { searchParams: SearchInterface }) {
    const suppliers = await getSuppliers();
    return <>
        <PageTmp title={"Поставщики"} filter={<CreateSupplier />} >
            <Client suppliers={suppliers} searchParams={props.searchParams} />
        </PageTmp>
    </>
}
