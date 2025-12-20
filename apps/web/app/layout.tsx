import type { Metadata } from 'next'
import './globals.css'
import { ToastContainer } from '../components/ui/Toast'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import LayoutClient from '../components/layout/LayoutClient'

export const metadata: Metadata = {
  title: 'ProcurePilot - Compare Vendor Offers With Evidence',
  description: 'Upload vendor quotation PDFs. Get weighted recommendations with page-level proof. Store immutable audit records on Hyperledger Fabric.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <LayoutClient>
          <Navbar />
          {children}
          <Footer />
        </LayoutClient>
        <ToastContainer />
      </body>
    </html>
  )
}

