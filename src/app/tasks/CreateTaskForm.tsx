import SideModal from "@/components/SideModal/SideModal";
import { $modalIsOpen, setModalIsOpen } from "@/components/clients/controlPanel/components/create-lead/store/modalState";
import { useStore } from "effector-react";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Employee } from "../components/types/employee";
import onSubmit from "./onSubmit";
import PlusCircleIcon from "@/components/clients/controlPanel/components/create-lead/media/plus_circle.svg"
import Image from "next/image";
import DatePicker from "react-datepicker";
import getEmployees from "./getEmployees";

export default function CreateTaskForm() {
    const modalIsOpen = useStore($modalIsOpen);
    const { register, handleSubmit, control, reset } = useForm<any>();
    const [employees, setEmployees] = useState<Employee[]>([]);

    useEffect(() => {
        (async function () { setEmployees(await getEmployees()) })();
    }, [])

    return <>
        <button className="btn btn-primary me-3" onClick={() => { setModalIsOpen(true); }} >
            <Image src={PlusCircleIcon} alt="" className="me-2" width={15} height={15} />
            Создать задачу
        </button>
        <SideModal isOpen={modalIsOpen} closeHandle={() => setModalIsOpen(false)}>
            <>
                <div className="border-bottom px-4 py-3 h3">Создать задачу</div>
                <div className="px-4">
                    <form
                        onSubmit={handleSubmit((e: any) => onSubmit(e, reset))}
                        style={{ maxWidth: "1000px" }}
                    >
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td>Описание задачи</td>
                                    <td>
                                        <textarea className="form-control"  {...register("description")} autoComplete="off" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Ответственный</td>
                                    <td>
                                        <select {...register("role", { required: true })} defaultValue="" className="form-select" aria-label="Default select example">
                                            <option value="" disabled>
                                                Выберите ответственного
                                            </option>
                                            {employees.filter(employee => !employee.is_boss).map(employee => <option key={employee.id}>{employee.username}</option>)}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Дедлайн</td>
                                    <td>
                                        <Controller
                                            control={control}
                                            name="deadline"
                                            render={({ field }) => (
                                                <DatePicker
                                                    locale="ru"
                                                    {...field}
                                                    dateFormat="dd.MM.yyyy"
                                                    selected={field.value}
                                                    onChange={(date) => field.onChange(date)}
                                                    placeholderText="выберите дату"
                                                    className="form-control"
                                                />
                                            )}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <button className="btn btn-sm btn-outline-dark">Сохранить</button>
                    </form>
                </div>
            </>
        </SideModal>
    </>
}
