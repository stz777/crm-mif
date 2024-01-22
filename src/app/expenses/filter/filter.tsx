import { ExpensesCategoryInterface } from "@/types/expenses/expensesCategoryInterface"
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import DatePicker, { registerLocale } from "react-datepicker";
import ru from 'date-fns/locale/ru';
registerLocale('ru', ru);

export default function Filter(props: {
    expensesCategories: ExpensesCategoryInterface[],
    searchParams: any
}) {
    const { register, handleSubmit, formState: { errors }, control, reset } = useForm<any>(
        {
            defaultValues: {
                phones: [{ phone: "" }],
                emails: [{ email: "" }],
            }
        }
    );
    const router = useRouter();
    return <>
        <form
            onSubmit={handleSubmit(e => onSubmit(e))}
            style={{ maxWidth: "1000px" }}>

            <div className="d-flex">
                <select style={{ maxWidth: "300px" }} {...register("category", {
                    required: true, onChange: (e) => {
                        const currentParams = props.searchParams;
                        if (e.target.value === "") {
                            delete currentParams.category;
                        } else {
                            currentParams.category = e.target.value;
                        }
                        const fromEntriedParams = Object.entries(currentParams).map(x => x.join("=")).join("&");
                        const qs = fromEntriedParams.length ? `?${fromEntriedParams}` : "";
                        const url = window.location.pathname + qs;
                        router.push(url);
                    }
                })} defaultValue="" className="form-select" aria-label="Default select example">
                    <option value="">
                        Выберите категорию
                    </option>
                    {props.expensesCategories.map(category => <option value={category.id}>{category.name}</option>)}
                </select>

                <Controller
                    control={control}
                    name="date_from"
                    render={({ field }) => (
                        <DatePicker
                            locale="ru"
                            {...field}
                            dateFormat="dd.MM.yyyy"
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            placeholderText="от"
                            className="form-control"
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="date_to"
                    render={({ field }) => (
                        <DatePicker
                            locale="ru"
                            {...field}
                            dateFormat="dd.MM.yyyy"
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            placeholderText="до"
                            className="form-control"
                        />
                    )}
                />
                {/* <button className="btn btn-primary">показать</button> */}
            </div>
        </form>
    </>
}

async function onSubmit(values: any) {
    // console.log('values', values);
}