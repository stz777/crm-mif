import Link from "next/link";
import LogoutBTN from "../api/auth/logout/logoutBTN";
import { cookies } from "next/headers";
import { getUserByToken } from "../components/getUserByToken";

export default async function SideMenu() {
    const auth = cookies().get('auth');
    if (!auth?.value) return;
    const user = await getUserByToken(auth?.value);
    if (!user) return null;
    return <div className="px-2">

        <div className="bordered mb-3">
            {!user.is_boss ? null :
                <>
                    <h3 className="m-0">Avito</h3>
                    <ul className="list-group">
                        <li><Link href="/avito" className="list-group-item text-nowrap">Avito (на ремонт закрыто)</Link></li>
                    </ul>
                </>}
        </div>

        <div className="bordered mb-3">
            <h3 className="m-0">Сотрудники</h3>
            <ul className="list-group">
                <li><Link href="/employees/create" className="list-group-item text-nowrap">Создать сотрудника</Link></li>
                {!user.is_boss ? null : <li><Link href="/employees/get" className="list-group-item text-nowrap">Список сотрудников</Link></li>}
            </ul>
        </div>

        <div className="bordered mb-3">
            <h3 className="m-0">Клиенты</h3>
            <ul className="list-group">
                {!user.is_manager ? null : <li><Link href="/clients/create" className="list-group-item text-nowrap">Создать клиента</Link></li>}
                <li>
                    {!user.is_manager ? null : <Link href="/clients/get" className="list-group-item text-nowrap">Список клиентов</Link>}
                </li>
            </ul>
        </div>

        <div className="bordered mb-3">
            <h3 className="m-0">Заказы</h3>
            <ul className="list-group">
                <li >
                    <Link href="/leads/get" className="list-group-item text-nowrap">Список заказов</Link>
                </li>
            </ul>
        </div>

        {!user.is_boss ? null : <div className="bordered mb-3">
            <h3 className="m-0">Отчет</h3>
            <ul className="list-group">
                <li><Link href="/fin_report" className="list-group-item text-nowrap">Отчет</Link></li>
            </ul>
        </div>}

        {!user.is_manager ? null : <div className="bordered mb-3">
            <h3 className="m-0">Закупки</h3>
            <ul className="list-group">
                <li><Link href="/purchasing_tasks/create" className="list-group-item text-nowrap">Создать задачу-закупку</Link></li>
                <li><Link href="/purchasing_tasks/get" className="list-group-item text-nowrap">Список задач-закупок</Link></li>
                <li><Link href="/suppliers/create" className="list-group-item text-nowrap">Создать поставщика</Link></li>
                <li><Link href="/suppliers/get" className="list-group-item text-nowrap">Список поставщиков</Link></li>
                <li><Link href="/materials/get" className="list-group-item text-nowrap">Материалы</Link></li>
            </ul>
        </div>}

        {!user.is_manager ? null : <div className="bordered mb-3">
            <h3 className="m-0">Закупки</h3>
            <ul className="list-group">
                <li><Link href="/projects/create" className="list-group-item text-nowrap">Создать проект</Link></li>
                <li><Link href="/projects/get" className="list-group-item text-nowrap">Список проектов</Link></li>
            </ul>
        </div>}

        <div className="mt-3"><LogoutBTN /></div>
    </div>
} 