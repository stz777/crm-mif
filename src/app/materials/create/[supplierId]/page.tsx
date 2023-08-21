import { getSupplierById } from "@/app/suppliers/single/[id]/page";
import CreateMaterialForm from "./createMaterialForm";

export default async function Page({ params }: { params: { supplierId: number } }) {
    const { supplierId } = params;
    const supplier = await getSupplierById(supplierId);
    return <>
        <h1>Создать материал</h1>
        <h3>Поставщик: {supplier.name}</h3>
        <CreateMaterialForm supplier_id={supplier.id}/>
    </>
}

