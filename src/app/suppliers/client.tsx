"use client"
import { useState, useEffect, JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal } from "react";
import { SupplierInterface } from "../components/types/supplierInterface";
import { SearchInterface } from "./types";
import { toast } from "react-toastify";
import SideModal from "@/components/SideModal/SideModal";

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


// function TaskTr(props: {
//     task: SupplierInterface,
//     children: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined;
// }) {
//     const [is_open, setIsOpen] = useState(false);
//     return <>
//         <tr onClick={() => {
//             setIsOpen(true);
//         }}>
//             {props.children}
//         </tr>
//         <SideModal isOpen={is_open} closeHandle={() => setIsOpen(false)}>
//             <>
//                 {/* <SupplierDetails task={props.task} /> */}
//             </>
//         </SideModal>
//     </>
// }


// function SupplierDetails(props: { task: SupplierInterface }) {
//     return <>
//         <div className="d-flex align-items-center border-bottom px-4 py-3 ">
//             <div className="h3">Детали задачи</div>
//             <span className="ms-3 text-secondary" style={{ fontSize: "0.9em" }}>ID: {props.task.id}</span>
//         </div>
//         <div className="px-4">



//             <div><Wrapper title="Описание">{props.task.description}</Wrapper></div>
//             <div><Wrapper title="Ответственный">{props.task.managerName}</Wrapper></div>
//             <div><Wrapper title="Дата создания">{dayjs(props.task.created_date).format("DD.MM.YYYY")}</Wrapper></div>
//             <div><Wrapper title="Дата создания">
//                 {dayjs(props.task.deadline).format("DD.MM.YYYY")}
//             </Wrapper></div>
//             <div><Wrapper title="Статус выполнения">
//                 <div className="mt-2"><TaskStatus deadline={props.task.deadline} done_at={props.task.done_at} /></div>
//             </Wrapper></div>
//             <div><Wrapper title="">
//                 {props.task.done_at ? dayjs(props.task.created_date).format("DD.MM.YYYY") :
//                     <button onClick={() => closeTask(props.task.id)} className="btn btn-outline-dark">Завершить задачу</button>
//                 }
//             </Wrapper></div>
//         </div>
//     </>
// }


// function Wrapper(props: {
//     title: string;
//     children: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined;
// }) {
//     return <>
//         <div className="d-flex mb-3">
//             <div style={{ width: 220 }}>{props.title}</div>
//             <div>{props.children}</div>
//         </div>
//     </>
// }