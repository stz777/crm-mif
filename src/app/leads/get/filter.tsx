"use client"
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
    id: string,
    is_archive: boolean,
};

export default function Filter(props: any) {

    const { searchParams } = props;

    let defaultValues: any = {};

    if (Object.keys(searchParams)?.length) {
        for (const key in searchParams) {
            if (key === "id") {
                defaultValues.id = searchParams['id']
            }
            if (key === "is_archive") {
                defaultValues.is_archive = true
            }
        }
    }

    const { register, handleSubmit, } = useForm<Inputs>({
        defaultValues: defaultValues
    });
    const onSubmit: SubmitHandler<Inputs> = data => {
        const { origin, pathname } = window.location;
        const qs = Object.entries(data).filter(v => !!v[1]).map(v => `${v[0]}=${v[1]}`).join("&");
        const newLink = `${origin}/${pathname}?${qs}`;
        window.open(newLink, "_self");
    }

    return (<>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="me-2">
                            <h6>ID</h6>
                            <input  {...register("id")} autoComplete="off" />
                        </div>
                        <div className="me-2">
                            <h6>В архиве</h6>
                            <input
                                type="checkbox"
                                {...register("is_archive")}
                            />
                        </div>
                    </div>
                    <button className="btn btn-sm btn-outline-dark mt-2">фильтр</button>
                    <div className="btn btn-sm btn-outline-dark mt-2"
                        onClick={() => {
                            const { origin, pathname } = window.location;
                            const newLink = `${origin}/${pathname}`;
                            window.open(newLink, "_self");
                        }}
                    >сбросить</div>
                </div>
            </div>
        </form>
    </>
    );
}