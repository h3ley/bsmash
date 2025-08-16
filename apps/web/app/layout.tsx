import "./globals.css";
import type { ReactNode } from "react";
export const metadata = {
  title: "bsmash",
  description: "Book courts & groups",
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-neutral-50 text-neutral-900">
        <div className="mx-auto max-w-5xl p-4">{children}</div>
      </body>
    </html>
  );
}
