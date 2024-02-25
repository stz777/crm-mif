import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function CategoryNameEditor(props: { expensesCategoryId: number, expensesCategoryName: string }) {
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
    </>
}

async function fetchUpdateExpensesCategoryName(category_id: number, category_name: string) {
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