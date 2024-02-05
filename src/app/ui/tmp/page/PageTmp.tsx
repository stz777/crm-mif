import { ReactNode } from "react";

export default function PageTmp(props: { title: string, children: ReactNode, filter?: ReactNode }) {
    return <>
        <h1>{props.title}</h1>
        {props.filter && <div className="mt-3 mb-1">
            {props.filter}
        </div>}
        <div className="mt-4">
            {props.children}
        </div>
    </>
}