import { ReactNode } from "react";

export default function PageTmp(props: { text: string, children: ReactNode }) {
    return <>
        <h1>{props.text}</h1>
        <div className="mt-4">
            {props.children}
        </div>
    </>
}