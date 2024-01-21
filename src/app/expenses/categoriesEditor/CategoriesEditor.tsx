"use client"

import SideModal from "@/components/SideModal/SideModal";
import { ExpensesCategoryInterface } from "@/types/expenses/expensesCategoryInterface";
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import CreateCategoryForm from "./CreateCategoryForm";
import { toast } from "react-toastify";

export default function CategoriesEditor(props: { expensesCategories: ExpensesCategoryInterface[] }) {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    useEffect(() => {

    }, [])
    return <>
        <button className="btn btn-outline-dark" onClick={() => setModalIsOpen(true)}>Создание/редактирование категорий</button>
        <SideModal isOpen={modalIsOpen} closeHandle={() => setModalIsOpen(false)}>
            <>
                <div className="d-flex align-items-center border-bottom px-4 py-3 ">
                    <h3>Создание/редактирование категорий</h3>
                </div>
                <div className="px-4">
                    {props.expensesCategories.map(category => <div key={category.id}>
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
    const { register, handleSubmit, control, reset, setValue, getValues } = useForm<any>({
        defaultValues: {
            id: props.expensesCategoryId,
            name: props.expensesCategoryName,
        }
    });
    const [isChanged, setIsChanged] = useState(false);


    useEffect(() => {
        setIsChanged(false);
    }, [props])

    return <>
        <form
            onSubmit={handleSubmit(() => null)}
            style={{ maxWidth: "1000px" }}
        >
            <div className="d-flex mb-3">
                <input type="text" className="form-control"
                    {...register(`name`, {
                        onChange: (e: any) => {
                            const newString = e.target.value;
                            console.log('newString', newString, props.expensesCategoryName);
                            if (newString !== props.expensesCategoryName) {
                                setIsChanged(true);
                            } else {
                                setIsChanged(false);
                            }
                        }
                    })}
                    autoComplete="off" />

                {isChanged && <>

                    <button className="btn btn-sm btn-outline-success" onClick={async () => {
                        const updated = await fetchUpdateExpensesCategoryName(props.expensesCategoryId, getValues('name'))
                        if (updated) {
                            toast.success('Название категории изменено');
                        }

                    }}>изменить</button>

                    <button className="btn btn-sm btn-outline-danger" onClick={() => {
                        reset();
                        setIsChanged(false);
                    }}>отменить</button>

                </>}

            </div>

        </form>
        {/* <div className="p-2 border mb-3">{props.expensesCategoryName} ({props.expensesCategoryId})</div> */}
    </>
}

function fetchUpdateExpensesCategoryName(category_id: number, category_name: string) {
    return fetch("/api/expenses-categories/edit-name",
        {
            method: "POST",
            body: JSON.stringify({
                category_id,
                category_name
            })
        })
        .then(x => x.json())
        .then(x => {
            console.log('xxx', x);

            return x.success;
        })

}