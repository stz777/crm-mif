"use client"
import { useState, useEffect } from "react";
import { SupplierInterface } from "../../components/types/supplierInterface";
import { SearchInterface } from "../types";
import SupplierTr from "./SupplierTr";
import fetchGetSuppliersData from "./fetchGetSuppliersData";

export default function Client(props: { suppliers: SupplierInterface[], searchParams: SearchInterface }) {
    const [suppliers, setSuppliers] = useState(props.suppliers);

    useEffect(() => {
        let mounted = true;
        (async function refresh() {
            if (!mounted) return;
            await new Promise(r => setTimeout(() => {
                r(1)
            }, 2000));
            const newSuppliersData = await fetchGetSuppliersData(props.searchParams);
            if (JSON.stringify(newSuppliersData) !== JSON.stringify(suppliers)) setSuppliers(newSuppliersData);
            setTimeout(() => {
                refresh();
            }, 2000);
        })()
        return () => { mounted = false; }
    }, [props]);

    return <>
        <table className="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>наименование</th>
                    <th>контакты</th>
                    <th>материалы</th>
                </tr>
            </thead>
            <tbody>
                {suppliers.map(supplier => <SupplierTr supplier={supplier} key={supplier.id}>
                    <td>{supplier.id}</td>
                    <td>{supplier.name}</td>
                    <td>{supplier.contacts}</td>
                    <td>{supplier.materials}</td>
                </SupplierTr>)}
            </tbody>
        </table>
    </>
}
