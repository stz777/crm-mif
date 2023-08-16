import { getEmployees } from "./getEmployeesFn";

export default async function Page() {
    const employees = await getEmployees();
    return <>
        <h1>Сотрудники</h1>
        <table className="table table-bordered">
            <thead>
                <tr>
                    <th>id</th>
                    <th>Имя сотрудника</th>
                    <th>Телеграм</th>
                    <th>Регистрация в телеге</th>
                    <th>Контакты</th>
                </tr>
            </thead>
            <tbody>
                {employees.map(employee => <tr key={employee.id}>
                    <td>{employee.id}</td>
                    <td>{employee.username}</td>
                    <td>{employee.telegram_id}</td>
                    <td>{employee.tg_chat_id}</td>
                    <td>{(() => {
                        if (!employee.meta) return null;
                        return <table>
                            <tbody>
                                {employee.meta.map(meta => <tr key={meta.id}>
                                    <td>{meta.data_type}</td>
                                    <td>{meta.data}</td>
                                </tr>)}
                            </tbody>
                        </table>
                    })()}</td>
                </tr>)}
            </tbody>
        </table>
    </>
}
