import { pool } from "../db/connect";
import PageTmp from "../ui/tmp/page/PageTmp";
import { EmployeeInterface, EmployeeMeta } from "./types";

export default async function Page() {
    const employees = await getEmployees({});
    const employeesWithMeta = await Promise.all(
        employees.map(async employee => ({
            ...employee,
            meta: await getEmploeeMetaFromDB({})
        }))
    );
    return <>
        <PageTmp title="Сотрудник">
            <>
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
                                    <tr>
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
                                            <button className="btn btn-sm btn-outline-dark"></button>
                                        </td>
                                    </tr>
                                )
                        }
                    </tbody>
                </table>
            </>
        </PageTmp>
    </>
}

async function getEmployees(searchParams: SearchParamsInterface): Promise<EmployeeInterface[]> {
    return pool.promise().query("select * from employees ")
        .then(([x]: any) => x)
        .catch(error => {
            console.error('error #f64645', error);
            return [];
        })
}

async function getEmploeeMetaFromDB(searchParams: SearchParamsInterface): Promise<EmployeeMeta[]> {
    return pool.promise().query(
        "select * from employees_meta"
    )
        .then(([x]: any) => x)
        .catch(error => {
            console.error('error #kdd87', error);
            return [];
        })
}

interface SearchParamsInterface {

}