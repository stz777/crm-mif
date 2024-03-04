import { Employee } from "@/app/components/types/employee";
import FieldWrapper from "@/app/ui/form/fieldWrapper";
import SideModal from "@/components/SideModal/SideModal";
import { formatPhoneNumber } from "@/components/clients/controlPanel/components/tools/formatPhoneNumber";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type FormValues = {
    id: number
    username: string
    phone: string;
    email: string;
    telegram_id: string;
    role: string
    is_active: string
};

export default function EmployeeEditor(props: {
    employee: Employee,
}) {
    const [isOpen, setIsOpen] = useState(false);


    const phone = props.employee.meta?.find(item => item.data_type === "phone")?.data || "";
    const email = props.employee.meta?.find(item => item.data_type === "email")?.data || "";

    const { register, handleSubmit, formState: { errors }, control, reset, setValue } = useForm<FormValues>(
        {
            defaultValues: {
                id: props.employee.id,
                username: props.employee.username,
                telegram_id: props.employee.telegram_id,
                phone: formatPhoneNumber(phone),
                email,
                role: String(Number(props.employee.is_manager)),
                is_active: String(Number(props.employee.is_active))
            }
        }
    );

    return <>
        <button className="btn btn-outline-dark" onClick={() => {
            setIsOpen(true)
        }}>Редактировать</button>
        <SideModal isOpen={isOpen}
            closeHandle={() => {
                setIsOpen(false);
            }}>
            <div className="border-bottom px-4 py-3 h3">Создать сотрудника</div>
            <div className="px-4">

                <form onSubmit={handleSubmit(e => onSubmit(e, reset))}>

                    <table>
                        <tbody>
                            <FieldWrapper title="Имя сотрудника"
                                field={<>
                                    <input {...register("username", { required: true })} autoComplete="off" className="form-control" />
                                </>}
                            />

                            <FieldWrapper title="Телефоны"
                                field={<>
                                    <div className="d-flex mb-2">
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <div className="input-group-text">+7</div>
                                            </div>
                                            <div className="my-2"></div>
                                            <input type="text" className="form-control"
                                                {...register(`phone`, {
                                                    onChange: (e: any) => {
                                                        const newString = formatPhoneNumber(e.target.value);
                                                        setValue('phone', newString)
                                                    }
                                                })}
                                                placeholder="000 000 00 00" autoComplete="off" />
                                        </div>
                                    </div>
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
                        </tbody>
                    </table>
 

                    <button className="btn btn-sm btn-dark">Сохранить</button>

                </form>
            </div>
        </SideModal>
    </>

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
