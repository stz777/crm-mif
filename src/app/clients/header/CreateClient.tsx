import { $modalIsOpen, setModalIsOpen } from "@/components/clients/controlPanel/components/create-lead/store/modalState";
import { useStore } from "effector-react";
import Image from "next/image";
import PlusCircleIcon from "@/components/clients/controlPanel/components/create-lead/media/plus_circle.svg"
import SideModal from "@/components/SideModal/SideModal";
import CreateClientForm from "@/components/clients/controlPanel/components/create-lead/CreateClientForm";

export default function CreateClient() {
    const modalIsOpen = useStore($modalIsOpen);
    return <>
        <button className="btn btn-primary me-3" onClick={() => { setModalIsOpen(true); }} >
            <Image src={PlusCircleIcon} alt="" className="me-2" width={15} height={15} />
            Создать клиента
        </button>
        <SideModal isOpen={modalIsOpen} closeHandle={() => setModalIsOpen(false)}>
            <>
                <div className="border-bottom px-4 py-3 h3">Создать клиента</div>
                <div className="px-4">
                    <CreateClientForm />
                </div>
            </>
        </SideModal>
    </>
}