import { ReactNode } from 'react';

export default function FieldWrapper({ title, field }: { title: string, field: ReactNode }) {
    return <>
        <div className="row mb-2">
            <div className='col-lg-2'>{title}</div>
            <div className='col-lg-7'>{field}</div>
        </div>
    </>
}