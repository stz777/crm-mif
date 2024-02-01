"use client"

import SideModal from "@/components/SideModal/SideModal";
import { $componentState } from "@/components/clients/controlPanel/components/create-lead/store/componentState";
import { $modalIsOpen, setModalIsOpen } from "@/components/clients/controlPanel/components/create-lead/store/modalState";
import { useStore } from "effector-react";
import { JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function Client() {
    return <>
        <h1>Склад</h1>
        <div className="d-flex justify-content-between">
            <div className="d-flex">
                <CreateMaterial />
                {/* <CreateLead />
                <div className="d-flex">
                    <Search searchParams={props.searchParams} />
                    <Image
                        src={SearchIcon}
                        alt=""
                        style={{
                            marginTop: "13px",
                            marginLeft: "-28px",
                        }}
                        className="me-2"
                        width={15}
                        height={15}
                    />
                </div> */}
            </div>
            {/* {(() => {
                const { searchParams } = props;
                return (
                    <button
                        onClick={() => {
                            if (searchParams.is_archive) {
                                delete searchParams.is_archive;
                            } else {
                                searchParams.is_archive = "true";
                            }
                            const { pathname, origin } = window.location;
                            const qs = querystring.encode(searchParams);
                            const linkParts = [pathname, `?${qs}`];
                            const link = `${origin}/${pathname}?${qs}`;
                            window.location.href = link
                        }}
                        className="btn btn-outline-dark float-left"
                    >
                        {searchParams.is_archive ? "скрыть" : "показать"} архив
                    </button>
                );
            })()} */}
        </div>
    </>
}

function CreateMaterial() {
    // const modalIsOpen = useStore($modalIsOpen);
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
                    toast.success("Категория создана");
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