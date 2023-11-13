import { ReactNode } from 'react';

export default function FieldWrapper({ title, field }: { title: string, field: ReactNode }) {
    return <>
        <tr className="">
            <td>{title}</td>
            <td>{field}</td>
        </tr>
    </>
}