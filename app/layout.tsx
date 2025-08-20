import type React from "react"
import type { Metadata } from "next"
import { Cormorant_Garamond, Inter } from "next/font/google"
import "./globals.css"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Iki & Gai - Premium Bar & Lounge | New Delhi",
  description:
    "An intimate sanctuary for connoisseurs. Experience crafted excellence with artisanal cocktails, expert mixology, and sophisticated atmosphere in the heart of New Delhi.",
  generator: "v0.app",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <head>
        <style>{`
html {
  font-family: ${inter.style.fontFamily};
  --font-sans: ${inter.variable};
  --font-serif: ${cormorant.variable};
}
        `}</style>
      </head>
      <body className={`${inter.variable} ${cormorant.variable} font-sans antialiased bg-black text-white`}>{children}</body>
    </html>
  )
}
