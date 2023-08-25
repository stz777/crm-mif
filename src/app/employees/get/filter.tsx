"use client"
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
    is_active: boolean,
};

export default function Filter(props: { searchParams: { is_active: number } }) {

    const { searchParams } = props;

    let defaultValues: any = {};

    if ((typeof searchParams?.is_active === "number") && searchParams?.is_active === 0) {
        defaultValues.is_active = false;
    } else {
        defaultValues.is_active = true;
    }

    const { register, handleSubmit, } = useForm<Inputs>({
        defaultValues: defaultValues
    });

    const onSubmit: SubmitHandler<Inputs> = data => {
        const query: { is_active?: number } = {
        }
        if (data.is_active === false) {
            query.is_active = 0;
        }
        const { origin, pathname } = window.location;
        const qs = Object.entries(query).map(v => `${v[0]}=${v[1]}`).join("&");
        const newLink = `${origin}/${pathname}?${qs}`;
        window.open(newLink, "_self");
    }

    return (<>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="me-2">
                            <h6>Действует</h6>
                            <input
                                type="checkbox"
                                {...register("is_active")}
                            />
                        </div>
                    </div>
                    <button className="btn btn-sm btn-outline-dark mt-2">фильтр</button>
                </div>
            </div>
        </form>
    </>
    );
}