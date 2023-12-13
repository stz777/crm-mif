import Link from "next/link";
import images from "./icons/Images"
import { cookies } from "next/headers";
import { getUserByToken } from "../components/getUserByToken";

export default async function SideMenu() {
    const auth = cookies().get('auth');
    if (!auth?.value) return;
    const user = await getUserByToken(auth?.value);
    if (!user) return null;
    return <div>
        {menuItems.map((item, i) =>
            <div key={i} className={`list-group-item ${!i && "list-group-item-light"}`}>
                <div className="d-flex">
                    <Link href={item.link} className="text-decoration-none text-dark d-block py-3 px-3">{item.icon} <span className="ms-1">{item.title}</span></Link>
                </div>
            </div>)
        }
    </div>
}

const menuItems: { title: string, icon: any, link: string, }[] = [
    { title: "Заказы", icon: images.leads, link: "/" },
    { title: "Задачи", icon: images.tasks, link: "/tasks" },
    { title: "Расходы", icon: images.expenses, link: "/expenses" },
    { title: "Склад", icon: images.stock, link: "/stock" },
    { title: "Поставщики", icon: images.suppliers, link: "/suppliers" },
    { title: "Клиенты", icon: images.clients, link: "/clients" },
    { title: "Сотрудники", icon: images.employees, link: "/employees" },
    { title: "Отчеты", icon: images.report, link: "/report" },
]