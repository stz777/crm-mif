"use client"
import Image from "next/image"
import PlusCircleIcon from "./plus_circle.svg"
import './styles.css'; // Подключение вашего CSS файла
import SearchIcon from "./search.svg"
import { toast } from "react-toastify";

export default function ControlPanel() {
    return <div className="d-flex justify-content-between">
        <div className="d-flex">
            <button className="btn btn-primary me-3"
                onClick={() => toast.success("Хуяк это сделалось")}
            >
                <Image src={PlusCircleIcon} alt="" className="me-2" width={15} height={15} />
                Создать заказ
            </button>
            <div className="d-flex">
                <input type="text" style={{ width: 250 }} className="form-control" placeholder="Поиск" />
                <Image src={SearchIcon} alt="" style={{
                    marginTop: "13px", marginLeft: "-28px"
                }} className="me-2" width={15} height={15} />
            </div>
        </div>
        <button onClick={() => toast.success("Хуяк то сделалось")} className="btn btn-outline-dark float-left">Показать архив</button>
    </div>
}
