"use client"
import { useEffect, useState } from "react"
import { Employee, getEmployeesByProjectId } from "./getEmployeesByProjectd";
import { useForm, } from "react-hook-form"
import { toast } from "react-toastify";

export function RightsManagement({ project_id }: { project_id: number }) {
    const [open, setOpen] = useState(false);

    const [employees, setEmployees] = useState<null | Employee[]>(null)

    useEffect(() => {
        if (open) {
            (async () => {
                const employees = await getEmployeesByProjectId(project_id);
                setEmployees(employees);
            })()
        } else {
            setEmployees(null);
        }
    }, [open, project_id])

    if (!open) return <button className="btn btn-sm btn-outline-dark" onClick={() => setOpen(true)}>Права</button>

    return <>
        <div className="card">
            <div className="card-header">
                <div className="card-title text-nowrap">Управление правами</div>
            </div>
            <div className="card-body">
                {(() => {
                    if (!employees) return <>Ждем сотрудников</>
                    return <>
                        <table className="table table-bordered">
                            <tbody>
                                {employees.map((employee, i) => <tr key={employee.user_id + project_id + i}>
                                    <td className="text-nowrap">{employee.username}</td>
                                    <td className="text-nowrap"> <RightsForm role={employee.role} employeeId={employee.user_id} project_id={project_id} />  </td>
                                </tr>)}
                            </tbody>
                        </table>
                    </>
                })()}
                <button className="btn btn-sm btn-outline-dark" onClick={() => setOpen(false)}>Закрыть</button>
            </div>
        </div>
    </>
}

type Inputs = { role: any }

function RightsForm({ role, employeeId, project_id }: { role: string | null, employeeId: number, project_id: number }) {

    const {
        register,
    } = useForm<Inputs>({
        defaultValues: {
            role: role ? role : "no_rights"
        }
    })

    const roles = [
        ['Нет прав', "no_rights"],
        ['Исполнитель', 'executor'],
        ['Контроллер', 'inspector'],
        ['Наблюдатель', 'viewer'],
    ];

    return <>
        <form>
            <div className="d-flex">
                {roles.map((role, i) => <div key={role[1]} className="form-check me-2 p-1 ps-4">
                    <input
                        className="form-check-input"
                        type="radio"
                        value={role[1]}
                        id={role[1] + employeeId + project_id}
                        {...register("role")}
                        onChange={(e) => {
                            onChangeUserRole(employeeId, project_id, e.target.value);
                        }}
                    />
                    <label className="form-check-label" htmlFor={role[1] + employeeId + project_id}>
                        {role[0]}
                    </label>
                </div>)}
            </div>
        </form>
    </>
}

function onChangeUserRole(employeeId: number, project_id: number, role: string) {
    fetch(
        `/api/projects/update_employee_rights`,
        {
            method: "POST",
            body: JSON.stringify({ employeeId, role, project_id })
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
            toast.success("Права пользователя обновлены");
        } else {
            toast.error("Что-то пошло не так");
        }
    })
        .catch(error => {
            toast.error("Что-то пошло не так");
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
                            err: "#msvfIb7m4dj",
                            data: {
                                statusText,
                                values: { employeeId, role }
                            }
                        }
                    })
                }
            )
                .then(x => x.json())
        })
}