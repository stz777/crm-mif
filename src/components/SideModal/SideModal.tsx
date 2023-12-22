"use client"
import { ReactElement, ReactNode, ReactPortal, PromiseLikeOfReactNode } from "react";
export default function SideModal(props: {
    isOpen: boolean,
    closeHandle: () => void,
    children: ReactElement<any> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined;
}) {
    if (!props.isOpen) return null;
    return <>
        <div className="shadow" style={{ position: "fixed", right: 0, top: 0, width: "560px", height: "100vh", background: "white", zIndex: 9999 }} >
            {props.children}
        </div>
        <div onClick={() => props.closeHandle()} className="w-100 h-100" style={{ position: "fixed", left: 0, top: 0, zIndex: 9998, background: "rgba(238, 238, 238, 0.5)" }} />
    </>
}