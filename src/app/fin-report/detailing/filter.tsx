"use client"
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";

type Inputs = {
    year: string,
};

type ReportSearchInterface = any;

export default function Filter(props: { searchParams: ReportSearchInterface }) {
    const route = useRouter();

    const { searchParams } = props;

    let defaultValues: any = {};

    if (Object.keys(searchParams)?.length) {
        for (const key in searchParams) {
            if (key === "year") {
                defaultValues.year = searchParams['year']
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

    return (<>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="me-2">
                            <h6>Год</h6>
                            <input type="number"  {...register("year")} autoComplete="off" />
                        </div>
                    </div>
                    <button className="btn btn-sm btn-outline-dark mt-2 me-2">фильтр</button>
                    <div className="btn btn-sm btn-outline-dark mt-2"
                        onClick={() => {
                            reset();
                            route.push(window.location.pathname);
                        }}
                    >сбросить</div>
                </div>
            </div>
        </form>
    </>
    );
}