"use client"

import SideModal from "@/components/SideModal/SideModal";
import { ExpensesCategoryInterface } from "@/types/expenses/expensesCategoryInterface";
import {  useState } from "react"
import CreateCategoryForm from "./CreateCategoryForm";
import CategoryNameEditor from "./CategoryNameEditor";

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
