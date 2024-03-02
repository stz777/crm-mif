import { SupplierInterface } from "@/app/components/types/supplierInterface";
import SideModal from "@/components/SideModal/SideModal";
import { JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useState } from "react";
import SupplierDetails from "./SupplierDetails";
import { toast } from "react-toastify";

export default function SupplierTr(props: {
    supplier: SupplierInterface,
    children: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined;
}) {
    const [is_open, setIsOpen] = useState(false);
    function closeModal() {
        toast('');
        setIsOpen(false);
    }
    return <>
        <tr onClick={() => {
            setIsOpen(true);
        }}>
            {props.children}
            <td>
                <SideModal isOpen={is_open} closeHandle={() => setIsOpen(false)}>
                    <>
                        <SupplierDetails supplier={props.supplier} close={closeModal} />
                    </>
                </SideModal>
            </td>
        </tr>
    </>
}