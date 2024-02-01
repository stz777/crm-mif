import SideModal from "@/components/SideModal/SideModal";
import { useState, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function CreateMaterial() {
    const [isOpen, setIsOpen] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
    } = useForm<any>();

    function onSubmit(values: any) {
        fetch(
            "/api/stock/create-material",
            {
                method: "post",
                body: JSON.stringify(values)
            }
        )
            .then(x => x.json())
            .then(x => {
                if (x.success) {
                    toast.success("Материал создан");
                    reset();
                } else {
                    toast.error("Что-то пошло не так #ff5f84");
                }
            })
            .catch(err => {
                console.log('error', err);
                toast.error("Что-то пошло не так #fjf884")
            })
    }
    return <>
        <button className="btn btn-primary me-3" onClick={() => { setIsOpen(true); }} >
            Добавить материал
        </button>
        <SideModal isOpen={isOpen} closeHandle={() => setIsOpen(false)}>
            <div className="border-bottom px-4 py-3 h3" >
                Добавить материал
            </div>
            <div className="px-4">
                <div>
                    <form onSubmit={handleSubmit(x => {
                        onSubmit(x);
                    })}>
                        <Wrapper title="Наименование">
                            <input {...register("material", { required: true })} className="form-control" autoComplete="off" />
                        </Wrapper>
                        <Wrapper title="Количество">
                            <input {...register("count", {
                                required: true,
                                pattern: /^[0-9]+$/i
                            })} className="form-control" autoComplete="off" />
                        </Wrapper>
                        <div className="d-flex">
                            <button className="btn btn-sm btn-outline-dark">Сохранить</button>
                            <div className="btn btn-sm btn-outline-danger ms-2" onClick={() => {
                                setIsOpen(false);
                                reset();
                            }}>отмена</div>
                        </div>
                    </form>
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