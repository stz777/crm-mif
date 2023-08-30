import Link from "next/link";
import LogoutBTN from "../api/auth/logout/logoutBTN";
import { cookies } from "next/headers";
import { getUserByToken } from "../components/getUserByToken";

export default async function SideMenu() {
    const auth = cookies().get('auth');
    if (!auth?.value) return;
    const user = await getUserByToken(auth?.value);
    if (!user) return <>no user</>
    return <div className="">
        <ul className="list-group">
            {!user.is_boss ? null :
                <>
                    <li>
                        <Link href="/employees/create" className="list-group-item text-nowrap">Создать сотрудника</Link>
                    </li>
                </>}
            {!user.is_boss ? null : <li><Link href="/employees/get" className="list-group-item text-nowrap">Список сотрудников</Link></li>}
            {!user.is_manager ? null : <li><Link href="/clients/create" className="list-group-item text-nowrap">Создать клиента</Link></li>}
            <li>
                {!user.is_manager ? null : <Link href="/clients/get" className="list-group-item text-nowrap">Список клиентов</Link>}
            </li>
            <li >
                <Link href="/leads/get" className="list-group-item text-nowrap">Список заказов</Link>
            </li>
            {!user.is_boss ? null : <li><Link href="/fin_report" className="list-group-item text-nowrap">Отчет</Link></li>}

            {!user.is_manager ? null : <li><Link href="/purchasing_tasks/create" className="list-group-item text-nowrap">Создать задачу-закупку</Link></li>}

            {!user.is_manager ? null : <li><Link href="/purchasing_tasks/get" className="list-group-item text-nowrap">Список задач-закупок</Link></li>}

            {!user.is_manager ? null : <li><Link href="/suppliers/create" className="list-group-item text-nowrap">Создать поставщика</Link></li>}

            {!user.is_manager ? null : <li><Link href="/suppliers/get" className="list-group-item text-nowrap">Список поставщиков</Link></li>}

            {!user.is_manager ? null : <li><Link href="/materials/get" className="list-group-item text-nowrap">Материалы</Link></li>}

            {!user.is_manager ? null : <li><Link href="/projects/create" className="list-group-item text-nowrap">Создать проект</Link></li>}

            {!user.is_manager ? null : <li><Link href="/projects/get" className="list-group-item text-nowrap">Список проектов</Link></li>}

        </ul>
        <div className="mt-3"><LogoutBTN /></div>
    </div>
} 