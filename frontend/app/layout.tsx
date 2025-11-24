import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BlueMind - Ocean Microbiome Intelligence",
  description: "Explore, simulate, and understand ocean microbiome ecosystems - Now fully standalone!",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
        <script dangerouslySetInnerHTML={{
          __html: `
            // Initialize demo data on first load
            if (typeof window !== 'undefined') {
              const DEMO_ACCOUNT = {
                email: 'demo@bluemind.com',
                password: 'demo123',
                name: 'Demo User',
              };
              
              const STORAGE_KEYS = {
                USERS: 'bluemind_users',
              };
              
              const usersData = localStorage.getItem(STORAGE_KEYS.USERS);
              const users = usersData ? JSON.parse(usersData) : [];
              const demoExists = users.find(u => u.email === DEMO_ACCOUNT.email);
              
              if (!demoExists) {
                users.push({
                  id: 999,
                  email: DEMO_ACCOUNT.email,
                  password: DEMO_ACCOUNT.password,
                  name: DEMO_ACCOUNT.name,
                  created_at: new Date().toISOString(),
                });
                localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
              }
            }
          `
        }} />
      </body>
    </html>
  )
}
