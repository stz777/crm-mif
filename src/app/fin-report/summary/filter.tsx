"use client"
import { useForm, SubmitHandler } from "react-hook-form";
import { ReportSearchInterface } from "./page";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

type Inputs = {
    year: string,
};

export default function Filter(props: { searchParams: ReportSearchInterface }) {
    const route = useRouter();

    const startYear = 2023;
    const nowYear = Number(dayjs().format("YYYY"));

    const years = [startYear].concat(Array.from({ length: nowYear - startYear }, (_, i) => startYear + i + 1)).reverse();

    const { searchParams } = props;

    let defaultValues: any = {
        year: String(nowYear)
    };

    if (Object.keys(searchParams)?.length) {
        for (const key in searchParams) {
            if (key === "year") {
                defaultValues.year = searchParams['year']
            }
        }
    }

    const { register, handleSubmit } = useForm<Inputs>({
        defaultValues: defaultValues
    });

    const onSubmit: SubmitHandler<Inputs> = data => {
        const { pathname } = window.location;
        const qs = Object.entries(data).filter(v => !!v[1]).map(v => `${v[0]}=${v[1]}`).join("&");
        const newLink = `${pathname}?${qs}`;
        route.push(newLink);
    }

    return (<>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="d-flex">
                <select {...register("year", { required: true })} defaultValue="" className="form-select" aria-label="Default select example">
                    {years.map(year => <option key={year} value={String(year)}>{year}</option>)}
                </select>
                <button className="btn btn-primary ms-2">Показать</button>
            </div>
        </form>
    </>
    );
}