import { ReactNode } from 'react';

export default function FieldWrapper({ title, field }: { title: string, field: ReactNode }) {
    return <>
        <tr className="">
            <td className='pe-2 pb-2'>{title}</td>
            <td className=' pb-3'>{field}</td>
        </tr>
    </>
}