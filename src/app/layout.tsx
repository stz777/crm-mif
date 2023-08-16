import Link from "next/link"
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>
        <header>
          <div className="container">
            <NavBar />
          </div>
        </header>
        <div className="container">
          {children}
        </div>
        <ToastContainer />
      </body>
    </html>
  )
}

function NavBar() {
  return <div className="container-fluid">
    <div className="d-flex">
      <div className="me-2">
        <Link href="/employees/create" className="btn btn-sm btn-outline-dark mb-2">Создать сотрудника</Link><br />
        <Link href="/employees/get" className="btn btn-sm btn-outline-dark">Список сотрудников</Link>
      </div>
      <div className="me-2">
        <Link href="/clients/create" className="btn btn-sm btn-outline-dark mb-2">Создать клиента</Link><br />
        <Link href="/clients/get" className="btn btn-sm btn-outline-dark">Список клиентов</Link>
      </div>
      <div>
        <Link href="/leads/create" className="btn btn-sm btn-outline-dark mb-2">Создать заказ</Link><br />
        <Link href="/leads/get" className="btn btn-sm btn-outline-dark">Список заказов</Link>
      </div>
    </div>
  </div>
}