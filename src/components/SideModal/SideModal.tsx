"use client"
import { ReactElement, ReactNode, ReactPortal, PromiseLikeOfReactNode, JSXElementConstructor } from "react";
export default function SideModal(props: {
    isOpen: boolean;
    children: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined;
    closeHandle: () => void;
}) {
    if (!props.isOpen) return null;
    return <>
        <div className="shadow" style={{
            position: "fixed", right: 0, top: 0,
            width: "560px", height: "100vh", overflowY: "scroll",
            background: "white", zIndex: 9999
        }} >
            {props.children}
        </div>
        <div onClick={(e) => {
            e.stopPropagation();
            props.closeHandle()
        }} className="w-100 h-100" style={{ position: "fixed", left: 0, top: 0, zIndex: 9998, background: "rgba(238, 238, 238, 0.5)" }} />
    </>
}