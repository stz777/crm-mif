import { useState } from "react";
import Wrapper from "./Wrapper";
import { RightsManagement } from "./righsManagement/rightsManagement";
import { Employee } from "../../types/employee";

export default function EmployeesController(props: { default_employees: Employee[], lead_id: number }) {
    const [viewEdit, setViewEdit] = useState(false);
    return <>
        <Wrapper title="Ответственные">
            {props.default_employees.map((employee, i) =>
                <div key={employee.id} className={`${i ? "mb-2" : ""}`}>{employee.username}</div>
            )}
            {!viewEdit && <button className="btn btn-sm btn-outline-secondary mt-2" onClick={() => setViewEdit(true)}>настроить права</button>}
        </Wrapper>
        {viewEdit && <RightsManagement leadId={props.lead_id} is_boss={true} closeFn={() => setViewEdit(false)} />}
    </>
}
