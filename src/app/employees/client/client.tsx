"use client"
import { Employee } from "@/app/components/types/employee";
import { SearchParamsInterface } from "../types";
import EmployeeTr from "../EmployeeTr";
import { useEffect, useState } from "react";
import fetchGetTaskData from "./fetchGetTaskData";
import EmployeeEditor from "./employeeEditor";

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
                                </td>
                                <td>
                                    <EmployeeEditor employee={employee} />
                                </td>
                            </EmployeeTr>
                        )
                }
            </tbody>
        </table>
    </>
}