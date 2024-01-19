import SideModal from "@/components/SideModal/SideModal";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode, useState } from "react";
import { ClientInterface } from "../components/types/clients";
import ClientDetails from "./ClientDetails";

export default function LeadTr(props: {
    client: ClientInterface,
    children: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined;
}) {
    const [is_open, setIsOpen] = useState(false);
    return <>
        <tr onClick={() => {
            setIsOpen(true);
        }}>
            {props.children}
        </tr>
        <SideModal isOpen={is_open} closeHandle={() => setIsOpen(false)}>
            <>
                <ClientDetails client={props.client} />
            </>
        </SideModal>
    </>
}