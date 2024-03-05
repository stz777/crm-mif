"use client"
import { Employee } from "@/app/components/types/employee";
import { EmployeeInterface, SearchParamsInterface } from "../types";
import { useEffect, useState } from "react";
import fetchGetTaskData from "./fetchGetTaskData";
import EmployeeEditor from "./employeeEditor";
import SideModal from "@/components/SideModal/SideModal";
import { EmployeeDetails } from "./employeeDetails/EmployeeDetails";

export default function Client(props: { employeesWithMeta: Employee[], searchParams: SearchParamsInterface }) {

    const [employeesWithMeta, setEmployees] = useState(props.employeesWithMeta);

    useEffect(() => {
        let mounted = true;
        (async function refresh() {
            if (!mounted) return;
            await new Promise(r => setTimeout(() => {
                r(1)
            }, 2000));
            const newEmployeesData = await fetchGetTaskData(props.searchParams);
            if (JSON.stringify(newEmployeesData) !== JSON.stringify(employeesWithMeta)) setEmployees(newEmployeesData);
            setTimeout(() => {
                refresh();
            }, 2000);
        })()
        return () => { mounted = false; }
    }, [props]);


    return <>
        <table className="table table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Имя / ФИО</th>
                    <th>Должность</th>
                    <th>Контакты</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    employeesWithMeta
                        .map(employee =>
                            <EmployeeTr key={employee.id} employee={employee}>
                                <td>{employee.id}</td>
                                <td>{employee.username}
                                </td>
                                <td>
                                    {(() => {
                                        if (employee.is_boss) return <>Босс</>
                                        if (employee.is_manager) return <>Менеджер</>
                                        return "должность не установлена";
                                    })()}
                                </td>
                                <td>
                                    {employee.meta?.map(metaItem => <div key={metaItem.id} className="my-2">
                                        {metaItem.data_type}: {metaItem.data}
                                    </div>)}
                                    <div>Telegram: {employee.telegram_id}</div>
                                </td>
                                <td onClick={(e) => e.stopPropagation()}>
                                    <EmployeeEditor employee={employee} />
                                </td>
                            </EmployeeTr>
                        )
                }
            </tbody>
        </table>
    </>
}


function EmployeeTr(props: {
    employee: EmployeeInterface,
    children: any;
}) {
    const [is_open, setIsOpen] = useState(false);
    return <>
        <tr onClick={() => {
            setIsOpen(true);
        }}>
            {props.children}
        </tr>
        <SideModal isOpen={is_open} closeHandle={() => setIsOpen(false)}>
            <>
                <EmployeeDetails employee={props.employee} />
            </>
        </SideModal>
    </>
}

