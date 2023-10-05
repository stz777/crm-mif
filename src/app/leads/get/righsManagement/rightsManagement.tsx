"use client"
import { useEffect, useState } from "react"
import { Employee, getEmployeesByLeadId } from "./getEmployeesByLeadId";
import { useForm, } from "react-hook-form"
import { toast } from "react-toastify";

export function RightsManagement({ leadId, is_boss }: { leadId: number, is_boss: boolean }) {
    const [open, setOpen] = useState(false);

    const [employees, setEmployees] = useState<null | Employee[]>(null)

    useEffect(() => {
        if (open) {
            (async () => {
                const employees = await getEmployeesByLeadId(leadId);
                setEmployees(employees);
            })()
        } else {
            setEmployees(null);
        }
    }, [open, leadId])

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
                                {employees.map((employee, i) => <tr key={employee.user_id + leadId + i}>
                                    <td className="text-nowrap">{employee.username}</td>
                                    <td className="text-nowrap"> <RightsForm role={employee.role} employeeId={employee.user_id} leadId={leadId} is_boss={is_boss} />  </td>
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

function RightsForm({ role, employeeId, leadId, is_boss }: { role: string | null, employeeId: number, leadId: number, is_boss: boolean }) {

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

    ];
    if (Boolean(is_boss)) {
        roles.push(...[['Контролер', 'inspector'],
        ['Наблюдатель', 'viewer'],])
    }

    return <>
        <form>
            <div className="d-flex">
                {roles.map((role, i) => <div key={role[1]} className="form-check me-2 p-1 ps-4">
                    <input
                        className="form-check-input"
                        type="radio"
                        value={role[1]}
                        id={role[1] + employeeId + leadId}
                        {...register("role")}
                        onChange={(e) => {
                            onChangeUserRole(employeeId, leadId, e.target.value);
                        }}
                    />
                    <label className="form-check-label" htmlFor={role[1] + employeeId + leadId}>
                        {role[0]}
                    </label>
                </div>)}
            </div>
        </form>
    </>
}

function onChangeUserRole(employeeId: number, leadId: number, role: string) {
    fetch(
        `/api/leads/update_employee_rights`,
        {
            method: "POST",
            body: JSON.stringify({ employeeId, role, leadId })
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
                            err: "#msn4b7m4dj",
                            data: {
                                statusText,
                                values: { employeeId, role }
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