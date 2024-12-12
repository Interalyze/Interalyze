export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="p-4 bg-gray-200">
          <nav>
            <a href="/" className="text-blue-600 underline">
              Home
            </a>{" "}
            |{" "}
            <a href="/dashboard" className="text-blue-600 underline">
              Dashboard
            </a>
          </nav>
        </header>
        <main className="p-8">{children}</main>
      </body>
    </html>
  );
}
