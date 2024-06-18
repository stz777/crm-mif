"use client"
import Link from "next/link"
import images from "./icons/Images"
import { useState } from "react"

export default function Client(props: { currentPath: string, isBoss: boolean }) {

    const [currentPath, setCurrentPath] = useState(props.currentPath);
    const menuItems = getMenuItems(props.isBoss);
    return <>
        {menuItems.map((item, i) => {
            if (item === false) return null;
            return <div key={i} className={`list-group-item ${item.link === currentPath && "list-group-item-light"}`}>
                <div >
                    <Link href={item.link} className="text-decoration-none text-dark d-block py-3 px-3 d-flex flex-nowrap"
                        onClick={() => setCurrentPath(item.link)}
                    >{item.icon} <span className="ms-1">{item.title}</span></Link>
                </div>
            </div>
        })
        }
    </>
}

type T = { title: any, icon: any, link: string, } | false;

function getMenuItems(isBoss: boolean): T[] {
    const menuItems = [
        { title: "Заказы", icon: images.leads, link: "/" },
        { title: <>Задачи</>, icon: images.tasks, link: "/tasks" },
        { title: "Расходы", icon: images.expenses, link: "/expenses" },
        { title: "Склад", icon: images.stock, link: "/stock" },
        {
            title: <>Поставщики </>, icon: images.suppliers, link: " /suppliers"
        },
        { title: "Клиенты", icon: images.clients, link: "/clients" },
        isBoss && { title: <>Сотрудники</>, icon: images.employees, link: "/employees" },
        isBoss && { title: <>Отчеты</>, icon: images.report, link: "/fin-report/summary" },
    ];
    // const filtered = menuItems.filter(x => x !== null);
    return menuItems;

}