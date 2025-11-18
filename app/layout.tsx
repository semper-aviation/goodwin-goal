import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Goodwin - To the Moon mission",
  description: "Dashboard for the To The Moon mission",
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
