"use client"
import Link from "next/link"
import images from "./icons/Images"
import { useState } from "react"

export default function Client(props: { currentPath: string }) {
    const [currentPath, setCurrentPath] = useState(props.currentPath);
    return <>
        {menuItems.map((item, i) =>
            <div key={i} className={`list-group-item ${item.link === currentPath && "list-group-item-light"}`}>
                <div >
                    <Link href={item.link} className="text-decoration-none text-dark d-block py-3 px-3 d-flex flex-nowrap"
                        onClick={() => setCurrentPath(item.link)}
                    >{item.icon} <span className="ms-1">{item.title}</span></Link>
                </div>
            </div>)
        }
    </>
}

const menuItems: { title: string, icon: any, link: string, }[] = [
    { title: "Заказы", icon: images.leads, link: "/" },
    { title: "Задачи", icon: images.tasks, link: "/tasks" },
    { title: "Расходы", icon: images.expenses, link: "/expenses" },
    { title: "Склад", icon: images.stock, link: "/stock" },
    { title: "Поставщики", icon: images.suppliers, link: "/suppliers" },
    { title: "Клиенты", icon: images.clients, link: "/clients" },
    { title: "Сотрудники", icon: images.employees, link: "/employees" },
    { title: "Отчеты", icon: images.report, link: "/fin-report/summary" },
]