"use client"

import SideModal from "@/components/SideModal/SideModal";
import { ExpensesCategoryInterface } from "@/types/expenses/expensesCategoryInterface";
import { useState } from "react"
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function CategoriesEditor(props: { expensesCategories: ExpensesCategoryInterface[] }) {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    return <>
        <button className="btn btn-outline-dark" onClick={() => setModalIsOpen(true)}>Создание/редактирование категорий</button>
        <SideModal isOpen={modalIsOpen} closeHandle={() => setModalIsOpen(false)}>
            <>
                <div className="d-flex align-items-center border-bottom px-4 py-3 ">
                    <h3>Создание/редактирование категорий</h3>
                </div>
                <div className="px-4">
                    {props.expensesCategories.map(category => <div>
                        <CategoryNameEditor
                            key={category.id}
                            expensesCategoryId={category.id}
                            expensesCategoryName={category.name}
                        />
                    </div>)}
                    <div className="mt-4">
                        <CreateCategoryForm />
                    </div>
                </div>
            </>
        </SideModal>
    </>
}


function CategoryNameEditor(props: { expensesCategoryId: number, expensesCategoryName: string }) {

    return <>
        <div className="p-2 border mb-3">{props.expensesCategoryName} ({props.expensesCategoryId})</div>
    </>
}

function CreateCategoryForm() {

    const [isOpen, setIsOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
    } = useForm<any>();

    if (!isOpen) return <button className="btn btn-outline-dark btn-sm" onClick={() => {
        setIsOpen(true);
    }}>Добавить категорию</button>

    return (
        <div>
            <div className="fw-bold">Создание категории расходов</div>
            <form onSubmit={handleSubmit(x => {
                onSubmit(x);
                reset();
            })}>
                <div className="mb-2"><input {...register("name", { required: true })} placeholder="Название категории" className="form-control" autoComplete="off" /></div>
                <div className="d-flex">
                    <button className="btn btn-sm btn-outline-dark">Сохранить</button>
                    <div className="btn btn-sm btn-outline-danger ms-2" onClick={() => {
                        setIsOpen(false);
                        reset();
                    }}>отмена</div>
                </div>
            </form>
        </div>
    )
}

function onSubmit(values: any) {
    fetch(
        "/api/expenses-categories/create",
        {
            method: "post",
            body: JSON.stringify(values)
        }
    )
        .then(x => x.json())
        .then(x => {
            console.log('x', x);
            if (x.success) {
                toast.success("Категория создана");
            } else {
                toast.error("Ошибка! Возможно категория с таким названием уже существует. #v0v84");
            }
        })
}