import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from "next/font/google";
import "./globals.css";

// 🔤 Using the ultra-stable Inter font instead of Geist
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Trustora - Digital Trust Platform",
  description: "Verify before you trust.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}