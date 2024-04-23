"use client";
import Image from "next/image";
import { Provider } from "react-redux";
import { store } from "@/store";
import logo from '@/assets/imgs/logo.png';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./globals.scss";

const WrappedPage = (props: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <title>Tan Phong Joint Stock Company</title>
      </head>
      <body className="container" suppressHydrationWarning={true}>
        <div className="logo">
          <Image src={logo} alt="TanPhongGroup" />
        </div>
        <div className="main paddingBase">
          {props.children}
        </div>
        <ToastContainer />
      </body>

    </html>

  )
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <Provider store={store}>
      <WrappedPage>
        {children}
      </WrappedPage>
    </Provider>
  );
}
