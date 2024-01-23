"use client"
import { useForm, SubmitHandler, Controller } from "react-hook-form";
// import { ReportSearchInterface } from "./page";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";

type Inputs = any;

export default function Filter(props: { searchParams: any }) {
    const router: any = useRouter();

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

    const { register, handleSubmit, control } = useForm<Inputs>({
        defaultValues: defaultValues
    });



    return (<>
        <form onSubmit={handleSubmit(v => onSubmit(v, router))}>
            <div className="d-flex">
                <div className="me-2" style={{ width: "150px" }}>
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
                </div>
                <div className="me-2" style={{ width: "150px" }}>
                    <Controller
                        control={control}
                        name="date_to"
                        render={({ field }) => (
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
        </form >
    </>
    );
}

const onSubmit: SubmitHandler<Inputs> = (values: any, router: any) => {
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