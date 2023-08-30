import Link from "next/link"
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LogoutBTN from "./api/auth/logout/logoutBTN";
import { cookies } from 'next/headers'
import getBasePermissions from "./components/permissions/getBasePermissions";
import { getUserByToken } from "./components/getUserByToken";
import SideMenu from "./side_menu/side_menu";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>
        <header>
        </header>
        <div className="d-flex">
          <div className="pe-3 position-sticky sticky-top"><SideMenu /></div>
          <div>{children}</div>
        </div>
        <ToastContainer />
      </body>
    </html>
  )
}

async function NavBar() {

  const auth = cookies().get('auth');
  const user = await getUserByToken(String(auth?.value));

  if (!user) return null;

  const basePermissions = await getBasePermissions(user.id, !!user.is_manager)

  return <div className="">
    <div className="">
      <div className="me-2">
        {!user.is_boss ? null : <><Link href="/employees/create" className="btn btn-sm btn-outline-dark mb-2">Создать сотрудника</Link><br /></>}
        {!user.is_boss ? null : <Link href="/employees/get" className="btn btn-sm btn-outline-dark">Список сотрудников</Link>}
      </div>
      <div className="me-2">
        {!user.is_manager ? null : <><Link href="/clients/create" className="btn btn-sm btn-outline-dark mb-2">Создать клиента</Link><br /></>}
        {!user.is_manager ? null : <Link href="/clients/get" className="btn btn-sm btn-outline-dark">Список клиентов</Link>}
      </div>
      <div className="me-2">
        <Link href="/leads/get" className="btn btn-sm btn-outline-dark">Список заказов</Link>
      </div>
      <div className="me-2">
        {!user.is_boss ? null : basePermissions.viewFinReport && <Link href="/fin_report" className="btn btn-sm btn-outline-dark">Отчет</Link>}
      </div>
      <div className="me-2">
        {!user.is_manager ? null : <Link href="/purchasing_tasks/create" className="btn btn-sm btn-outline-dark mb-2">Создать задачу-закупку</Link>}<br />
        {!user.is_manager ? null : <Link href="/purchasing_tasks/get" className="btn btn-sm btn-outline-dark ">Список задач-закупок</Link>}
      </div>
      <div className="me-2">
        {!user.is_manager ? null : <Link href="/suppliers/create" className="btn btn-sm btn-outline-dark mb-2">Создать поставщика</Link>}<br />
        {!user.is_manager ? null : <Link href="/suppliers/get" className="btn btn-sm btn-outline-dark ">Список поставщиков</Link>}
      </div>
      <div className="me-2">
        {!user.is_manager ? null : <Link href="/materials/get" className="btn btn-sm btn-outline-dark mb-2">Материалы</Link>}<br />
      </div>
      <div className="me-2">
        {!user.is_manager ? null : <Link href="/projects/create" className="btn btn-sm btn-outline-dark mb-2">Создать проект</Link>}<br />
        {!user.is_manager ? null : <Link href="/projects/get" className="btn btn-sm btn-outline-dark ">Список проектов</Link>}
      </div>
      <div className="mt-3"><LogoutBTN /></div>
    </div>
  </div>
}
