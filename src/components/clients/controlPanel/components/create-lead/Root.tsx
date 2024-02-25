"use client"

import { useStore } from "effector-react"
import { $modalIsOpen, setModalIsOpen } from "./store/modalState"
import Image from "next/image";
import PlusCircleIcon from "./media/plus_circle.svg"
import { $componentState } from "./store/componentState";
import SearchClient from "./SearchClient";
import { CreateLeadForm } from "./CreateLeadForm";
import CreateClientForm from "./CreateClientForm";
import SideModal from "@/components/SideModal/SideModal";

export default function Root() {
    const modalIsOpen = useStore($modalIsOpen);
    const componentState = useStore($componentState);
    return <>

        <button className="btn btn-primary me-3" onClick={() => { setModalIsOpen(true); }} >
            <Image src={PlusCircleIcon} alt="" className="me-2" width={15} height={15} />
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
                {(() => {
                    if (componentState === "default") return <><SearchClient /></>
                    if (componentState === "client_selected") return <><CreateLeadForm /></>
                    if (componentState === "client_not_selected") return <><CreateClientForm /></>
                })()}
            </div>
        </SideModal>

    </>
}
