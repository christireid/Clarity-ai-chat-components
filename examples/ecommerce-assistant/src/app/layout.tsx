export const metadata = {
  title: 'E-commerce AI Assistant',
  description: 'AI-powered shopping assistant for e-commerce',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
