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
