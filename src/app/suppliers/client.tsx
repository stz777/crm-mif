"use client"
import { useState, useEffect } from "react";
import { SupplierInterface } from "../components/types/supplierInterface";
import { SearchInterface } from "./types";
import { toast } from "react-toastify";

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
                {suppliers.map(supplier => <tr key={supplier.id}>
                    <td>{supplier.id}</td>
                    <td>{supplier.name}</td>
                    <td>{supplier.contacts}</td>
                    <td>{supplier.materials}</td>
                </tr>)}
            </tbody>
        </table>
    </>
}

async function fetchGetSuppliersData(searchParams: SearchInterface) {
    return await fetch(
        `/api/suppliers/get`,
        {
            method: "POST",
            body: JSON.stringify(searchParams)
        }
    ).then(
        response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error(response.statusText);
            }
        }
    ).then((data: any) => {
        if (data.success) {
            return data.suppliers;
        } else {
            toast.error("Что-то пошло не так #dms8s");
        }
    })
        .catch(_ => {
            toast.error("Что-то пошло не так #chxxd8y3");
        });
}