"use client"
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";

type Inputs = {
    year: string,
    month: string,
};



interface ReportSearchInterface {
    year: string,
    month: string,
};

export default function Filter(props: { searchParams: ReportSearchInterface }) {
    const route = useRouter();

    const { searchParams } = props;

    let defaultValues: any = {};

    if (Object.keys(searchParams)?.length) {
        for (const key in searchParams) {
            if (key === "year") {
                defaultValues.year = searchParams['year']
                defaultValues.month = searchParams['month']
            }
        }
    }

    const { register, handleSubmit, reset } = useForm<Inputs>({
        defaultValues: defaultValues
    });

    const onSubmit: SubmitHandler<Inputs> = data => {
        const { pathname } = window.location;
        const qs = Object.entries(data).filter(v => !!v[1]).map(v => `${v[0]}=${v[1]}`).join("&");
        const newLink = `${pathname}?${qs}`;
        route.push(newLink);
    }

    const years = getYearList(2022);

    return (<>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="me-2">
                            <select {...register("year", { required: true })} defaultValue="" className="form-select" aria-label="Default select example">
                                <option value="" disabled>
                                    Выберите год
                                </option>
                                {years.map(
                                    year => <option value={year} key={year}>{year}</option>
                                )}
                            </select>
                        </div>
                        <div className="me-2">
                            <select {...register("month", { required: true })} defaultValue="" className="form-select" aria-label="Default select example">
                                <option value="" disabled>
                                    Выберите месяц
                                </option>
                                {months.map(
                                    (month, i) => <option value={i + 1} key={month}>{month}</option>
                                )}
                            </select>
                        </div>
                    </div>
                    <button className="btn btn-sm btn-outline-dark mt-2 me-2">получить отчет</button>
                </div>
            </div>
        </form>
    </>
    );
}

function getYearList(startYear: number) {
    var currentYear = new Date().getFullYear();
    var yearList = [];
    for (var year = startYear; year <= currentYear; year++) {
        yearList.push(year);
    }
    return yearList.reverse();
}


const months = [
    "январь",
    "февраль",
    "март",
    "апрель",
    "май",
    "июнь",
    "июль",
    "август",
    "сентябрь",
    "октябрь",
    "ноябрь",
    "декабрь"
];