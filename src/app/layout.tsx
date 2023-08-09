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
          </ul>
        </header>
        {children}</body>
    </html>
  )
}
