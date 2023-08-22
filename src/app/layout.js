import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Loading...',
  description: '3D Scene',

}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-100">
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}
