"use client"

import { $modalIsOpen, reset, setModalIsOpen } from "@/components/clients/controlPanel/components/create-lead/store/modalState";
import { useStore } from "effector-react";
import Image from "next/image";
import PlusCircleIcon from "@/components/clients/controlPanel/components/create-lead/media/plus_circle.svg"
import SideModal from "@/components/SideModal/SideModal";
// import CreateClientForm from "@/components/clients/controlPanel/components/create-lead/CreateClientForm";
import { Controller, useForm } from "react-hook-form";
// import { toast } from "react-toastify";
import onSubmit from "./onSubmit";
import DatePicker from "react-datepicker";

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



    const inputValue: any = watch('image');


    return (
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
                                {/* <option value="0">Исполнитель</option>
                                <option value="1">Менеджер</option> */}
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
            {/* CreateTaskForm */}
            {/* <table className="table-borderless">
                <tbody>
                    <ClientFields
                        register={register}
                        phonesFields={phonesFields}
                        removePhone={removePhone}
                        appendPhone={appendPhone}
                        emailFields={emailFields}
                        removeEmail={removeEmail}
                        appendEmail={appendEmail}
                        telegramFields={telegramFields}
                        removeTelegram={removeTelegram}
                        appendTelegram={appendTelegram}
                        setValue={setValue}
                    />
                    <tr><th><>Заказ</></th><td></td></tr>
                    <LeadFields
                        control={control}
                        register={register}
                    />
                    <FieldWrapper title="Оплачено"
                        field={<>
                            <input className="form-control"  {...register("payment",)} autoComplete="off" />
                        </>}
                    />
                    <FieldWrapper title="Чек"
                        field={<>
                            {(inputValue?.length)
                                ? <>
                                    <div className="mb-2">Прикреплен файл: {inputValue[0].name}</div>
                                    <div onClick={() => {
                                        resetField("image");
                                    }} className="btn btn-sm btn-outline-danger">Отмена <FaTrash /></div>
                                </>
                                : <>
                                    <input type="file" id="image" {...register("image")} className="d-none" />
                                    <label htmlFor="image" className="btn btn-secondary">Выберите файл</label>
                                </>}
                        </>}
                    />
                </tbody>
            </table> */}
            <button className="btn btn-sm btn-outline-dark">Сохранить</button>
        </form>
    );
}
