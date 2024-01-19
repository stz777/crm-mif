"use client"

import SideModal from "@/components/SideModal/SideModal";
import { useState } from "react"
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function CategoriesEditor() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    return <>
        <button className="btn btn-outline-dark" onClick={() => setModalIsOpen(true)}>Создание/редактирование категорий</button>
        <SideModal isOpen={modalIsOpen} closeHandle={() => setModalIsOpen(false)}>
            <>
                <div className="d-flex align-items-center border-bottom px-4 py-3 ">
                    <h3>Создание/редактирование категорий</h3>
                </div>
                <div className="px-4">
                    <CreateCategoryForm />
                </div>
            </>
        </SideModal>
    </>
}

function CreateCategoryForm() {
    const [isOpen, setIsOpen] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<any>()

    if (!isOpen) return <div onClick={() => {
        setIsOpen(true);
    }}>Добавить категорию</div>

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-2"><input {...register("name", { required: true })} placeholder="Название категории" className="form-control" autoComplete="off" /></div>
                <button className="btn btn-sm btn-outline-dark">Сохранить</button>
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