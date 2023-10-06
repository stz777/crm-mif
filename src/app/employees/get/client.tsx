"use client"
import Link from "next/link";
import { Employee } from "@/app/components/types/employee";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Filter from "./filter";

export default function Client(props: { employees: Employee[], searchParams: { is_active: 1 | 0 } }) {
    const [employees, setEmployees] = useState(props.employees);
    const { searchParams } = props;

    useEffect(() => {
        let mount = true;
        (async function refreshData() {
            if (!mount) return;
            await new Promise(resolve => { setTimeout(() => { resolve(1); }, 1000); });
            const response = await fetchGetEmployees(searchParams);
            if (JSON.stringify(employees) !== JSON.stringify(response.eemployees)) setEmployees(response.employees);
            await refreshData();
        })();
        return () => { mount = false; }
    }, [employees])

    return <>
        <h1>Сотрудники</h1>
        <div className="mb-3"><Filter searchParams={searchParams} /></div>
        <table className="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>id</th>
                    <th>Имя сотрудника</th>
                    <th>Телеграм</th>
                    <th>Зарегистрирован (в tg)</th>
                    <th>Контакты</th>
                    <th>Должность</th>
                    <th>Действующий</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {employees.map(employee => <tr key={employee.id}>
                    <td>
                        <Link href={`/employees/get/${employee.id}`}>Сотрудник #{employee.id}</Link>
                    </td>
                    <td>{employee.username}</td>
                    <td>{employee.telegram_id}</td>
                    <td>{employee.tg_chat_id ? "да" : "нет"}</td>
                    <td>{!employee.meta ? null : <table><tbody>{employee.meta.map(meta => <tr key={meta.id}><td>{meta.data_type}</td><td>{meta.data}</td></tr>)}</tbody></table>}</td>
                    <td>{employee.is_manager ? "Менеджер" : "Исполнитель"}</td>
                    <td>{employee.is_active ? "Действующий" : "Уволен"}</td>
                    <td><Link href={`/employees/edit/${employee.id}`} className="btn btn-sm btn-outline-dark">Редактировать</Link></td>
                </tr>)}
            </tbody>
        </table>
    </>
}

async function fetchGetEmployees(searchParams: { is_active: 1 | 0 }) {
    return fetch(
        "/api/employees/get",
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
    ).then(data => {
        if (data.success) {
            if (!data.employees) {
                toast.error("Что-то пошло не так #cmdndsiIuf8");
            }
            return data;
        } else {
            toast.error("Что-то пошло не так");
        }
    })
        .catch(error => {
            const statusText = String(error);
            fetch(
                `/api/bugReport`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        text: {
                            err: "#adKmck3jm",
                            data: {
                                statusText,
                                values: {}
                            }
                        }
                    })
                }
            )
                .then(x => x.json())
                .then(x => {
                    console.log(x);
                })
        })
}