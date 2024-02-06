"use client"

import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { SearchParamsInterface } from "./types";
import { StockHistory } from "@/app/components/types/stock";
import { useRouter } from "next/navigation";


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
    const { register, handleSubmit } = useForm<any>({ defaultValues });            
    const router = useRouter();
    return <>
        <form
            onSubmit={handleSubmit(e => onSubmit(e, router))}
            style={{ maxWidth: "1000px" }}>
            <div className="d-flex">
                <select style={{ maxWidth: "250px" }} {...register("is_adjunction")} defaultValue="" className="form-select me-2" aria-label="Default select example">
                    <option value="">
                        Все операции
                    </option>
                    <option value="0">
                        Списания
                    </option>
                    <option value="1">
                        Пополнения
                    </option>
                </select>
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