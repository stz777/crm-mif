import { Employee } from "@/app/components/types/employee";
import SideModal from "@/components/SideModal/SideModal";
import { formatPhoneNumber } from "@/components/clients/controlPanel/components/tools/formatPhoneNumber";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function EmployeeEditor(props: { employee: Employee }) {
    const [isOpen, setIsOpen] = useState(false);

    const phone = props.employee.meta
        ? formatPhoneNumber(String(props.employee.meta.find(item => item.data_type === "phone")?.data))
        : "";

    const email = props.employee.meta
        ? props.employee.meta.find(item => item.data_type === "email")?.data
        : "";

        

    console.log('tg', props.employee.telegram_id);

    const { register, handleSubmit, control, reset, setValue } = useForm<any>({
        defaultValues: {
            ...props.employee,
            phone,
            email
        }
    });

    return <>
        <button className="btn btn-outline-dark" onClick={() => {
            setIsOpen(true)
        }}>Редактировать</button>
        <SideModal isOpen={isOpen}
            closeHandle={() => {
                setIsOpen(false);
            }}
        >
            <>
                {/* <pre>{JSON.stringify(props.employee, null, 2)}</pre> */}
                <div className="border-bottom px-4 py-3 h3">Создать сотрудника</div>
                <div className="px-4">
                    <form
                        onSubmit={handleSubmit((e: any) => onSubmit(e))}
                        style={{ maxWidth: "1000px" }}>
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td>Имя</td>
                                    <td><input className="form-control"  {...register("username")} autoComplete="off" /></td>
                                </tr>
                                <tr>
                                    <td>Должность</td>
                                    <td>
                                        <select {...register("is_manager", { required: true })} defaultValue="" className="form-select" aria-label="Default select example">
                                            <option value="" disabled>
                                                Выберите должность
                                            </option>
                                            <option value="0">Исполнитель</option>
                                            <option value="1">Менеджер</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Телефон</td>
                                    <td>
                                        <>
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
                                        </>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Email</td>
                                    <td><input className="form-control"  {...register("email")} autoComplete="off" /></td>
                                </tr>
                                <tr>
                                    <td>Telegram</td>
                                    <td><input className="form-control"  {...register("telegram_id")} autoComplete="off" /></td>
                                </tr>
                                <tr><td>
                                    <button className="btn btn-primary" onClick={() => {
                                        toast('up')
                                    }}>Сохранить</button>
                                </td></tr>
                            </tbody>
                        </table>
                    </form>
                    {/* <pre>{JSON.stringify(props.em   ployee, null, 2)}</pre> */}
                </div>
            </>
        </SideModal>
    </>
}

async function onSubmit(values: Employee & { phone: string, email: string }) {
    const { is_manager, username, telegram_id, email, phone } = values;
    console.log('is_manager, username, telegram_id, email, phone', {
        is_manager, username, telegram_id, email, phone
    });
}
