import Link from "next/link"
import 'bootstrap/dist/css/bootstrap.min.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header>
          <ul>
            <li><Link href="/clients/create">Создать клиента</Link></li>
            <li><Link href="/clients/get">Клиенты</Link></li>
            <li><Link href="/leads/create">Создать заказ</Link></li>
          </ul>
        </header>
        {children}</body>
    </html>
  )
}
