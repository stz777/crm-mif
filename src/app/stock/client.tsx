"use client"

import SideModal from "@/components/SideModal/SideModal";
import { $componentState } from "@/components/clients/controlPanel/components/create-lead/store/componentState";
import { $modalIsOpen, setModalIsOpen } from "@/components/clients/controlPanel/components/create-lead/store/modalState";
import { useStore } from "effector-react";

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
    const modalIsOpen = useStore($modalIsOpen);
    const componentState = useStore($componentState);
    return <>
        <button className="btn btn-primary me-3" onClick={() => { setModalIsOpen(true); }} >
            {/* <Image src={PlusCircleIcon} alt="" className="me-2" width={15} height={15} /> */}
            Создать заказ
        </button>

        <SideModal isOpen={modalIsOpen} closeHandle={() => setModalIsOpen(false)}>
            <div className="border-bottom px-4 py-3 h3" >
                {(() => {
                    if (["default", "client_selected"].includes(componentState)) return <>Создать заказ</>
                    if (["client_not_selected"].includes(componentState)) return <>Создать клиента</>
                })()}
            </div>
            <div className="px-4">
                {/* {(() => {
                    if (componentState === "default") return <><SearchClient /></>
                    if (componentState === "client_selected") return <><CreateLeadForm /></>
                    if (componentState === "client_not_selected") return <><CreateClientForm /></>
                })()} */}
            </div>
        </SideModal>

    </>
}