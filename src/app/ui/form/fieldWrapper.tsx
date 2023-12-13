import { ReactNode } from 'react';

export default function FieldWrapper({ title, field }: { title: string, field: ReactNode }) {
    return <>
        <tr className="">
            <td className='pb-3'>{title}</td>
            <td className='pb-3'>{field}</td>
        </tr>
    </>
}