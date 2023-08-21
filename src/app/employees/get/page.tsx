import { getEmployees } from "./getEmployeesFn";

export default async function Page() {
    const employees = await getEmployees();
    return <>
        <h1>Сотрудники</h1>
        <table className="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>id</th>
                    <th>Имя сотрудника</th>
                    <th>Телеграм</th>
                    <th>Зарегистрирован (в tg)</th>
                    <th>Контакты</th>
                    <th>Должность</th>
                </tr>
            </thead>
            <tbody>
                {employees.map(employee => <tr key={employee.id}>
                    <td>{employee.id}</td>
                    <td>{employee.username}</td>
                    <td>{employee.telegram_id }</td>
                    <td>{employee.tg_chat_id? "да" : "нет"}</td>
                    <td>{!employee.meta ? null : <table><tbody>{employee.meta.map(meta => <tr key={meta.id}><td>{meta.data_type}</td><td>{meta.data}</td></tr>)}</tbody></table>}</td>
                    <td>
                        {employee.is_manager ? "Менеджер" : "Исполнитель"}
                    </td>
                </tr>)}
            </tbody>
        </table>
    </>
}
