"use client"
import { useEffect, useState } from "react"
import { Employee, getEmployeesByLeadId } from "./getEmployeesByLeadId";
import { useForm, } from "react-hook-form"
import { toast } from "react-toastify";
import Wrapper from "../Wrapper";

export function RightsManagement(props: {
    closeFn(): unknown; leadId: number, is_boss: boolean
}) {
    const [employees, setEmployees] = useState<null | Employee[]>(null)
    useEffect(() => {
        (async () => {
            const employees = await getEmployeesByLeadId(props.leadId);
            setEmployees(employees);
        })()
    }, [props.leadId])
    return <>
        <h3>Управление правами</h3>
        {(() => {
            if (!employees) return <>Загружаем сотрудников</>
            return <>
                {employees.map((employee, i) => <div key={employee.user_id + props.leadId + i}>
                    <Wrapper title={employee.username}>
                        <RightsForm role={employee.role} employeeId={employee.user_id} leadId={props.leadId} is_boss={props.is_boss} />
                    </Wrapper>
                </div>)}
                <div onClick={() => { props.closeFn() }} className="text-decoration-underline text-secondary" style={{ cursor: "pointer" }}>Закрыть управление правами</div>
            </>
        })()}
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
    // if (Boolean(is_boss)) {
    //     roles.push(...[['Контролер', 'inspector'],
    //     ['Наблюдатель', 'viewer'],])
    // }

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