import Image from "next/image"
import PlusCircleIcon from "../../plus_circle.svg"
import { useEffect, useState } from "react"

export default function CreateTask() {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <button className="btn btn-primary me-3"
            onClick={() => {
                setIsOpen(true);
            }}
        >
            <Image src={PlusCircleIcon} alt="" className="me-2" width={15} height={15} />
            Создать заказ
        </button>
        {isOpen && <Modal isOpen={isOpen} setIsOpen={setIsOpen} />}
    </>
}


function Modal(props: { isOpen: boolean, setIsOpen: any }) {
    return <div
    >
        <div
            className="shadow"
            style={{
                position: "fixed", right: 0, top: 0, width: "560px", height: "100vh", background: "white", zIndex: 9999
            }}

        >
            <div className="border-bottom px-4 py-4 h3" >
                Создать заказ
            </div>
            <div className="px-4 ">
                <div className="text-secondary">
                    Поиск клиента
                </div>
                <div>
                    <div className="input-group mb-2">
                        <div className="input-group-prepend">
                            <div className="input-group-text">+7</div>
                        </div>
                        <div className="my-2"></div>
                        <input type="text" className="form-control" id="inlineFormInputGroup" placeholder="000 000 00 00" />
                    </div>
                </div>
            </div>
        </div>
        <div
            onClick={() => props.setIsOpen(false)}
            className="w-100 h-100" style={{ position: "fixed", left: 0, top: 0, zIndex: 9998, background: "rgba(238, 238, 238, 0.5)" }} />
    </div>
}






