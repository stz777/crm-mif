import { ExpensesCategoryInterface } from "@/types/expenses/expensesCategoryInterface"
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import DatePicker, { registerLocale } from "react-datepicker";
import ru from 'date-fns/locale/ru';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { ExpensesSearchParamsInterface } from "../types";
dayjs.extend(customParseFormat);
registerLocale('ru', ru);

export default function Filter(props: {
    expensesCategories: ExpensesCategoryInterface[],
    searchParams: ExpensesSearchParamsInterface
}) {
    const defaultValues: any = {};
    if (props.searchParams.date_from) {
        const date: any = dayjs(props.searchParams.date_from, "DD.MM.YYYY");
        let a = new Date(date);
        defaultValues.date_from = a;
    }
    if (props.searchParams.date_to) {
        const date: any = dayjs(props.searchParams.date_to, "DD.MM.YYYY");
        let a = new Date(date);
        defaultValues.date_to = a;
    }
    const { register, handleSubmit, formState: { errors }, control, reset } = useForm<ExpensesSearchParamsInterface>(
        {
            defaultValues: props.searchParams
        }
    );
    const router = useRouter();
    return <>
        <form
            onSubmit={handleSubmit(e => onSubmit(e, router))}
            style={{ maxWidth: "1000px" }}>
            <div className="d-flex">
                <select style={{ maxWidth: "250px" }} {...register("category", {
                })} defaultValue="" className="form-select me-2" aria-label="Default select example">
                    <option value="">
                        Выберите категорию
                    </option>
                    {props.expensesCategories.map(category => <option value={category.id} key={category.id}>{category.name}</option>)}
                </select>
                <div className="me-2">
                    <Controller
                        control={control}
                        name="date_from"
                        render={({ field }: any) => (
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
                </div>
                <div className="me-2">
                    <Controller
                        control={control}
                        name="date_to"
                        render={({ field }: any) => (
                            <DatePicker
                                locale="ru"
                                {...field}
                                dateFormat="dd.MM.yyyy"
                                selected={field.value}
                                onChange={(date) => field.onChange(date)} placeholderText="до"
                                className="form-control "
                            />
                        )}
                    />
                </div>
                <button className="btn btn-primary">показать</button>
            </div>
        </form>
    </>
}

async function onSubmit(values: any, router: any) {
    if (values.date_from) {
        values.date_from = dayjs(values.date_from).format("DD.MM.YYYY")
    }
    if (values.date_to) {
        values.date_to = dayjs(values.date_to).format("DD.MM.YYYY")
    }
    const fromEntriedParams = Object.entries(values)
        .filter(x => !!x).map(x => x.join("=")).join("&");
    const qs = fromEntriedParams.length ? `?${fromEntriedParams}` : "";
    const url = window.location.pathname + qs;
    router.push(url);
}