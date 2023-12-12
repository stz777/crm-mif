"use client"
import Image from "next/image"

import './styles.css'; // Подключение вашего CSS файла
import SearchIcon from "./search.svg"
import { toast } from "react-toastify";
import CreateLead from "./components/create-lead/Root";

export default function ControlPanel() {
    return <div className="d-flex justify-content-between">
        <div className="d-flex">
            <CreateLead />
            <div className="d-flex">
                <input type="text" style={{ width: 250 }} className="form-control" placeholder="Поиск" />
                <Image src={SearchIcon} alt="" style={{
                    marginTop: "13px", marginLeft: "-28px"
                }} className="me-2" width={15} height={15} />
            </div>
        </div>
        <button onClick={() => toast.success("Go GO GO!")} className="btn btn-outline-dark float-left">Показать архив</button>
    </div>
}
