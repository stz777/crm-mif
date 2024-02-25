"use client"

import { Controller, useForm } from "react-hook-form";
import { SearchParamsInterface } from "./types";
import { StockHistory } from "@/app/components/types/stock";
import { useRouter } from "next/navigation";

import DatePicker, { registerLocale } from "react-datepicker";
import ru from 'date-fns/locale/ru';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
registerLocale('ru', ru);


export default function Filter(props: {
    stockHistory: StockHistory[],
    searchParams: SearchParamsInterface
}) {
    const defaultValues: any = {};
    if (props?.searchParams.date_from) {
        const date: any = dayjs(props.searchParams.date_from, "DD.MM.YYYY");
        defaultValues.date_from = new Date(date);
    }
    if (props?.searchParams.is_adjunction) {
        defaultValues.is_adjunction = props.searchParams.is_adjunction ? String(props.searchParams.is_adjunction) : "";
    }
    if (props?.searchParams.date_to) {
        const date: any = dayjs(props.searchParams.date_to, "DD.MM.YYYY");
        defaultValues.date_to = new Date(date);
    }
    const { register, handleSubmit, control } = useForm<any>({ defaultValues });
    const router = useRouter();
    return <>
        <form onSubmit={handleSubmit(e => onSubmit(e, router))} style={{ maxWidth: "1000px" }}>
            <div className="d-flex">
                <div className="me-2">
                    <select style={{ maxWidth: "250px" }} {...register("is_adjunction")} defaultValue="" className="form-select " aria-label="Default select example">
                        <option value="">Все операции</option>
                        <option value="0">Списания</option>
                        <option value="1">Пополнения</option>
                    </select>
                </div>
                <div className="me-2"><Controller
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
                /></div>
                <div className="me-2"><Controller
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
                /></div>
                <div><button className="btn btn-primary">показать</button></div>
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