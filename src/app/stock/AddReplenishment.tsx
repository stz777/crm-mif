import SideModal from "@/components/SideModal/SideModal";
import { useState, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { StockInterface } from "../components/types/stock";

export default function AddReplenishment(props: { material: StockInterface }) {
    const [isOpen, setIsOpen] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
    } = useForm<any>({
        defaultValues: {
            materialId: props.material.id
        }
    });

    function onSubmit(values: any) {
        fetch(
            "/api/stock/add-replenishment",
            {
                method: "post",
                body: JSON.stringify(values)
            }
        )
            .then(x => x.json())
            .then(x => {
                if (x.success) {
                    toast.success("Склад пополнен");
                    reset();
                    setIsOpen(false);
                } else {
                    if (x.error) {
                        toast.error(`Что-то пошло не так: ${x.error}`);
                    } else {
                        toast.error("Что-то пошло не так #dfj388");
                    }
                }
            })
            .catch(err => {
                console.log('error', err);
                toast.error("Что-то пошло не так #fmfm3")
            })
    }
    return <>
        <button className="btn btn-outline-dark btn-sm" onClick={() => { setIsOpen(true); }} >
            Пополнить
        </button>
        <SideModal isOpen={isOpen} closeHandle={() => setIsOpen(false)}>
            <div>
                <div className="border-bottom px-4 py-3 h3" >
                    Пополнить: {props.material.material}
                </div>
                <div className="px-4">
                    <div>
                        <form onSubmit={handleSubmit(x => {
                            onSubmit(x);
                        })}>
                            <Wrapper title="Пополнить к-во">
                                <input {...register("count", {
                                    required: true,
                                    pattern: /^[0-9]+$/i
                                })} className="form-control" autoComplete="off" />
                            </Wrapper>
                            <Wrapper title="Комментарий">
                                <textarea {...register("comment", {
                                    required: true,
                                })} className="form-control" autoComplete="off" />
                            </Wrapper>
                            <div className="d-flex mt-3">
                                <button className="btn btn-sm btn-outline-dark">Сохранить</button>
                                <div className="btn btn-sm btn-outline-danger ms-2" onClick={() => {
                                    setIsOpen(false);
                                    reset();
                                }}>отмена</div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </SideModal>
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


