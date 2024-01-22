"use client"

import SideModal from "@/components/SideModal/SideModal";
import { ExpensesCategoryInterface } from "@/types/expenses/expensesCategoryInterface";
import { useState } from "react"
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function ExpenseCreator(props: { expensesCategories: ExpensesCategoryInterface[] }) {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const { register, handleSubmit, reset } = useForm<any>();
    return <>
        <button className="btn btn-primary text-nowrap" onClick={() => setModalIsOpen(true)}>Добавить расход</button>
        <SideModal isOpen={modalIsOpen} closeHandle={() => {
            setModalIsOpen(false);
            reset();
        }}>
            <>
                <div className="d-flex align-items-center border-bottom px-4 py-3 ">
                    <h3>Добавление нового расхода</h3>
                </div>
                <div className="px-4">
                    <form onSubmit={handleSubmit((e: any) => onSubmit(e, reset))}>
                        <table className="table table-borderless">
                            <tbody>
                                <tr>
                                    <td>Категория</td>
                                    <td>
                                        <select {...register("category", { required: true })} defaultValue="" className="form-select" aria-label="Default select example">
                                            <option value="" disabled>
                                                Выберите категорию
                                            </option>
                                            {props.expensesCategories.map(category => <option value={category.id} key={category.id}>{category.name}</option>)}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Описание</td>
                                    <th>
                                        <textarea className="form-control" {...register("description", { required: true })} autoComplete="off" />
                                    </th>
                                </tr>
                                <tr>
                                    <td>Сумма</td>
                                    <th>
                                        <input {...register("sum", { required: true })} autoComplete="off" className="form-control" />
                                    </th>
                                </tr>
                                {/* <tr>
                                    <td>Чек</td>
                                    <td>
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
                                    </td>
                                </tr> */}
                            </tbody>
                        </table>
                        <button className="btn btn-primary">Сохранить</button>
                    </form>
                </div>
            </>
        </SideModal>
    </>
}

function onSubmit(data: any, reset: any) {
    const formdata = new FormData();
    for (const key in data) {
        const element = data[key];
        if (key === "image") {
            for (let i = 0; i < element.length; i++) {
                formdata.append('images', element[i]);
            }
            continue;
        }
        formdata.append(key, element);
    }
    fetch(
        "/api/expenses/create",
        {
            method: "POST",
            body: formdata
        }
    )
        .then(x => x.json())
        .then(x => {
            if (x.success) {
                toast.success("Добавлена запись о расходах");
                reset();
            } else {
                toast.error("Что-то пошло не так #d9774");
            }
        })

}