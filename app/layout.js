import Navbar from "/components/Navbar";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div>
        <Navbar/>
        {children}
        </div>
        </body>
    </html>
  );
}
