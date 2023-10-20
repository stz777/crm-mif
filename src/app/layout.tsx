import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideMenu from "./side_menu/side_menu";
import Logo from "@/media/images/logo.png";
import Image from 'next/image';
import Link from 'next/link';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>
        <header className='border py-2 mb-3'>
          <div className="d-flex align-items-center">
            <div className="pe-3" style={{ width: "300px" }}>
              <div className="p-3">
                <Link href={"/"}>
                  <Image src={Logo} alt="МотоХит" width={268} />
                </Link>
              </div>
            </div>
            <div style={{ minWidth: "400px" }} className=' flex-grow-1'>
              {/* content */}
              <div className='text-center'>
                {/* <div className='h1 '>CRM 80 lvl</div> */}
              </div>
            </div>
          </div>
        </header>
        <div className="d-flex">
          <div className="pe-3 position-sticky sticky-top" style={{ width: "300px" }}><SideMenu /></div>
          <div style={{ minWidth: "400px" }}> {children}</div>
        </div>
        <ToastContainer />
      </body>
    </html>
  )
}
