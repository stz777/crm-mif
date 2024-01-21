import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function CreateCategoryForm() {

    const [isOpen, setIsOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
    } = useForm<any>();

    if (!isOpen) return <button className="btn btn-outline-dark btn-sm" onClick={() => {
        setIsOpen(true);
    }}>Добавить категорию</button>


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