import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { CartProvider } from "@/contexts/cart-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { ToastProvider } from "@/components/ui/toast-container"
import NotificationToastBridge from "@/components/notification-toast-bridge"
import PWAInstallPrompt from "@/components/pwa-install-prompt"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "YAMAARAW - Electric Vehicle Store",
  description: "Discover our complete range of electric vehicles for sustainable transportation",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <CartProvider>
            <NotificationProvider>
              <NotificationToastBridge />
              {children}
              <PWAInstallPrompt />
            </NotificationProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
