import { EmployeeInterface } from "../../types";
import Wrapper from "./Wrapper";

export function EmployeeDetails(props: { employee: EmployeeInterface }) {
    return <>
        <div className="d-flex align-items-center border-bottom px-4 py-3 ">
            <div className="h3">Детали задачи</div>
            <span className="ms-3 text-secondary" style={{ fontSize: "0.9em" }}>ID: {props.employee.id}</span>
        </div>
        <div className="px-4">
            <div><Wrapper title="ФИО">{props.employee.username}</Wrapper></div>
            <div><Wrapper title="Должность">{(() => {
                if (props.employee.is_boss) return <>Босс</>
                if (props.employee.is_manager) return <>Менеджер</>
                return "должность не установлена";
            })()}</Wrapper></div>
            <div><Wrapper title="Контакты">
                <table>
                    <tbody>
                        <tr><td className="pe-2">telegram:</td><td>{props.employee.telegram_id}</td></tr>
                        {props.employee.meta?.map(metaItem => <tr key={metaItem.id} className="my-2">
                            <td>{metaItem.data_type}:</td><td>{metaItem.data}</td>
                        </tr>)}
                    </tbody>
                </table>
            </Wrapper></div>
            <h3>Заказы в работе</h3>
            
        </div>
    </>
}


