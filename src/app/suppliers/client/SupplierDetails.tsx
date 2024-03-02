import { SupplierInterface } from "@/app/components/types/supplierInterface";
import Wrapper from "./Wrapper";
import { useState } from "react";
import EditSupplier from "./EditSupplier";

export default function SupplierDetails(props: { supplier: SupplierInterface, close: any }) {
    const [editMode, setEditModeStatus] = useState(false);
    return <>
        <div className="d-flex align-items-center border-bottom px-4 py-3 ">
            <div className="h3">Поставщик</div>
            <span className="ms-3 text-secondary" style={{ fontSize: "0.9em" }}>ID: {props.supplier.id}</span>
        </div>
        <div className="px-4">
            {editMode
                ? <Details supplier={props.supplier} />
                : <><EditSupplier supplier={props.supplier} /></>}
            <div className="mt-3">
                {editMode
                    ? <button className="btn btn-sm btn-outline-dark" onClick={() => { setEditModeStatus(true) }}>Редактировать</button>
                    : <button className="btn btn-sm btn-outline-danger" onClick={() => { props.close() }}>Отмена</button>}
            </div>
        </div>
    </>
}

function Details(props: { supplier: SupplierInterface }) {
    return <>
        <div><Wrapper title="Наименование">{props.supplier.name}</Wrapper></div>
        <div><Wrapper title="Контакты">{props.supplier.contacts}</Wrapper></div>
        <div><Wrapper title="Материалы">{props.supplier.materials}</Wrapper></div>
    </>
}