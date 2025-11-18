import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simple Todo",
  description: "A clean, accessible todo app running fully on the client with localStorage",
  applicationName: "Simple Todo",
  authors: [{ name: "Simple Todo" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563EB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-ocean text-gray-900" suppressHydrationWarning>
        <a href="#main" className="skip-link">Skip to content</a>
        <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
              Simple Todo
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Stay organized with a fast, accessible todo list. Data is stored locally in your browser.
            </p>
          </header>
          <main id="main" role="main" aria-label="Simple Todo main content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
