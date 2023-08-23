"use client"
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { Employee, EmployeeMeta } from "@/app/components/types/employee";
import FieldWrapper from "@/app/ui/form/fieldWrapper";

type FormValues = {
    id: number
    username: string
    phone: string;
    email: string;
    telegram_id: string;
    role: string
    is_active: string
};

export default function EditEmployeeForm(props: {
    employee: Employee,
    employeeMeta: EmployeeMeta[]
}) {

    const phone = props.employeeMeta.find(item => item.data_type === "phone")?.data || "";
    const email = props.employeeMeta.find(item => item.data_type === "email")?.data || "";

    const { register, handleSubmit, formState: { errors }, control, reset } = useForm<FormValues>(
        {
            defaultValues: {
                id: props.employee.id,
                username: props.employee.username,
                telegram_id: props.employee.telegram_id,
                phone,
                email,
                role: String(Number(props.employee.is_manager)),
                is_active: String(Number(props.employee.is_active))
            }
        }
    );

    return (
        <form onSubmit={handleSubmit(e => onSubmit(e, reset))}>

            <FieldWrapper title="Имя сотрудника"
                field={<>
                    <input {...register("username", { required: true })} autoComplete="off" className="form-control" />
                </>}
            />

            <FieldWrapper title="Телефоны"
                field={<>
                    <input {...register("phone", { required: true })} autoComplete="off" className="form-control" />
                </>}
            />

            <FieldWrapper title="Email"
                field={<>
                    <input {...register("email", { required: true })} autoComplete="off" className="form-control" />
                </>}
            />

            <FieldWrapper title="Телеграм"
                field={<>
                    <input {...register("telegram_id", { required: true })} autoComplete="off" className="form-control" />
                </>}
            />

            <FieldWrapper title="Должность"
                field={<>
                    <select {...register("role", { required: true })} defaultValue="" className="form-select" aria-label="Default select example">
                        <option value="" disabled>
                            Выберите должность
                        </option>
                        <option value="0">Исполнитель</option>
                        <option value="1">Менеджер</option>
                    </select>
                </>}
            />

            <FieldWrapper title="Действующий"
                field={<>
                    <select {...register("is_active", { required: true })} defaultValue="" className="form-select" aria-label="Default select example">
                        <option value="" disabled>
                            Выберите статус
                        </option>
                        <option value="1">Действующий</option>
                        <option value="0">Уволен</option>
                    </select>
                </>}
            />

            {/* <pre>{JSON.stringify({
                employee: props.employee,
                employeeMeta: props.employeeMeta
            }, null, 2)}</pre> */}

            <button className="btn btn-sm btn-dark">Сохранить</button>

        </form>
    );
}

const onSubmit = (data: any, resetForm: any) => {
    const { email, phone, role, telegram_id, username, is_active } = data;

    fetch(
        `/api/employees/edit/${data.id}`,
        {
            method: "POST",
            body: JSON.stringify({
                email, phone, role, telegram_id, username, is_active
            })
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
            toast.success("Сотрудник изменен");
            // resetForm();
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
                            err: "#dsadcmU7",
                            data: {
                                statusText,
                                values: data
                            }
                        }
                    })
                }
            )
                .then(x => x.json())
        })
}
