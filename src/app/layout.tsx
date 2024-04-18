"use client";
import Image from "next/image";
import { Provider } from "react-redux";
import { store } from "@/store";
import logo from '@/assets/imgs/logo.png';
import "./globals.scss";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
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
    </Provider>
  );
}
