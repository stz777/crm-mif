import { getSupplierById } from "@/app/suppliers/single/[id]/page";
import CreateMaterialForm from "./createMaterialForm";
import { getUserByToken } from "@/app/components/getUserByToken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { supplierId: number } }) {
    const auth = cookies().get('auth');
    if (!auth?.value) return redirect("/");
    const user = await getUserByToken(auth?.value);
    if (!user) return redirect("/");
    if (!user.is_manager) return redirect("/");
   
    const { supplierId } = params;
    const supplier = await getSupplierById(supplierId);
    return <>
        <h1>Создать материал</h1>
        <h3>Поставщик: {supplier.name}</h3>
        <CreateMaterialForm supplier_id={supplier.id}/>
    </>
}

