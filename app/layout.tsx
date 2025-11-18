import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Company Goals Dashboard",
  description: "Track and manage company goals",
  icons: [
    { rel: "shortcut icon", url: "/favicon.png", type: "image/x-icon" },
    { rel: "apple-touch-icon", url: "/webclip.png" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
