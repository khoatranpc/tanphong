"use client";
import Image from "next/image";
import { Obj } from "@/global";
import logo from '@/assets/imgs/logo.png';
import "./globals.scss";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Tan Phong Joint Stock Company</title>
      </head>
      <body className="container">
        <div className="logo">
          <Image src={logo} alt="TanPhongGroup" />
        </div>
        {children}
      </body>
    </html>
  );
}
