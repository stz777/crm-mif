import PageTmp from "../ui/tmp/page/PageTmp";
import CreateSupplier from "./CreateSupplier";

export default async function Page() {
    return <>
        <PageTmp title={"Поставщики"}
        // filter={<>
        //     <div className="d-flex justify-content-between">
        //         <CreateMaterial />
        //         <Link href={"/stock/history"} className="btn btn-outline-dark text-nowrap">Показать историю</Link>
        //     </div>
        // </>}
        >
            {/* <Client materials={materials} /> */}
            <>
                <CreateSupplier />
            </>
        </PageTmp>
    </>
}

