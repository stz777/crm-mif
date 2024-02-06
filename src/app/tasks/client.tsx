"use client"

import { $modalIsOpen, setModalIsOpen } from "@/components/clients/controlPanel/components/create-lead/store/modalState";
import { useStore } from "effector-react";
import Image from "next/image";
import PlusCircleIcon from "@/components/clients/controlPanel/components/create-lead/media/plus_circle.svg"
import SideModal from "@/components/SideModal/SideModal";
// import CreateClientForm from "@/components/clients/controlPanel/components/create-lead/CreateClientForm";
import { Controller, useForm } from "react-hook-form";
// import { toast } from "react-toastify";
import onSubmit from "./onSubmit";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
// import EmployeesCombinedInterface from "../leads/single/[id]/EmployeesCombinedInterface";
import { Employee } from "../components/types/employee";

export default function Client() {
    return <>
        <CreateTaskArea />
    </>
}

function CreateTaskArea() {
    const modalIsOpen = useStore($modalIsOpen);
    return <>
        <button className="btn btn-primary me-3" onClick={() => { setModalIsOpen(true); }} >
            <Image src={PlusCircleIcon} alt="" className="me-2" width={15} height={15} />
            Создать задачу
        </button>
        <SideModal isOpen={modalIsOpen} closeHandle={() => setModalIsOpen(false)}>
            <>
                <div className="border-bottom px-4 py-3 h3">Создать клиента</div>
                <div className="px-4">
                    <CreateTaskForm />
                </div>
            </>
        </SideModal>
    </>
}

function CreateTaskForm() {
    const { register, handleSubmit, control, reset, watch, setValue, resetField } = useForm<any>();


    const [employees, setEmployees] = useState<Employee[]>([]);

    useEffect(() => {
        fetch(
            "/api/employees/get",
            {
                method: "POST",
                body: JSON.stringify({})
            }
        )
            .then(x => x.json())
            .then(x => {
                console.log('x', x);
                if (!x.employees) {
                    toast.error("Что-то пошло не так #9fjj3m");
                    return;
                }
                setEmployees(x.employees);
            })
    }, [])


    return (
        <>
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
        </>
    );
}
