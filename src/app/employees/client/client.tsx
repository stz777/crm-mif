"use client"
import { Employee } from "@/app/components/types/employee";
import { SearchParamsInterface } from "../types";
import EmployeeTr from "../EmployeeTr";

export default function Client(props: { employeesWithMeta: Employee[], searchParams: SearchParamsInterface }) {
    return <>client
        <pre>{JSON.stringify(props)}</pre>
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
                    props.employeesWithMeta
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
                                    {employee.meta?.map(metaItem => <div className="my-2">
                                        {metaItem.data_type}: {metaItem.data}
                                    </div>)}
                                </td>
                                <td>
                                    <button className="btn btn-sm btn-outline-dark">Редактировать</button>
                                </td>
                            </EmployeeTr>
                        )
                }
            </tbody>
        </table>
    </>
}