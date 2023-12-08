import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideMenu from "./side_menu/side_menu";
import Logo from "@/media/images/logo.svg";
import Image from 'next/image';
import Link from 'next/link';
import LogoutBTN from './api/auth/logout/logoutBTN';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>
        <div className="d-flex">

          <div
            className="p-3 position-sticky sticky-top d-flex flex-column justify-content-between"
            style={{ width: "245px", height: "100vh", background: "var(--background-grey-light, #F4F5F5)" }}
          >
            <div>
              <div className='m-3'>
                <Link href={"/"} >
                  <Image src={Logo} alt="МотоХит" width={125} />
                </Link>
              </div>
              <SideMenu />
            </div>
            <div className="mt-3"><LogoutBTN /></div>
          </div>
          <div
            className='flex-grow-1 py-4 px-4'>{children}</div>
        </div>
        <ToastContainer />
      </body>
    </html>
  )
}
