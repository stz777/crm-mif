"use client"
import { SupplierInterface } from "@/app/components/types/supplierInterface";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function EditSupplier(props: { supplier: SupplierInterface }) {
    const {
        register,
        handleSubmit,
        reset,
    } = useForm<any>({
        defaultValues: props.supplier
    });

    return <>
        <div>
            <form onSubmit={handleSubmit(x => {
                onSubmit(x, reset);
            })}>
                <Wrapper title="Наименование">
                    <input {...register("name", { required: true })} className="form-control" autoComplete="off" />
                </Wrapper>
                <Wrapper title="Контакты">
                    <textarea {...register("contacts", {
                        required: true,
                    })} className="form-control" autoComplete="off" />
                </Wrapper>
                <Wrapper title="Материалы">
                    <textarea {...register("materials", {
                        required: true,
                    })} className="form-control" autoComplete="off" />
                </Wrapper>
                <div className="d-flex">
                    <button className="btn btn-sm btn-outline-dark">Сохранить</button>
                </div>
            </form>
        </div>
    </>
}

function Wrapper(props: {
    title: string;
    children: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined;
}) {
    return <>
        <div className="d-flex mb-3">
            <div style={{ width: 220 }}>{props.title}</div>
            <div>{props.children}</div>
        </div>
    </>
}

function onSubmit(values: any, reset: any) {
    fetch(
        "/api/suppliers/edit",
        {
            method: "post",
            body: JSON.stringify(values)
        }
    )
        .then(x => x.json())
        .then(x => {
            if (x.success) {
                toast.success("Успех");
                reset();
            } else {
                toast.error("Что-то пошло не так #d8h3");
            }
        })
        .catch(err => {
            console.log('error', err);
            toast.error("Что-то пошло не так #kdjdmd4")
        })
}