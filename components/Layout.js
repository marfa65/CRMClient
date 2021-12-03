import React from "react";
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  // Hook de routing
  const router = useRouter();

  return (
    <>
      <Head>
        <title>CRM - Administracón de Clientes</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
        />
        <link
          href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </Head>

      {router.pathname === "/login" || router.pathname === "/nuevacuenta" ? (
        <div className="bg-gradient-to-r from-gray-800 via-blue-900 to-gray-900 min-h-screen flex flex-col justify-center">
          <div>{children}</div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-300">
          <div className="sm:flex min-h-screen">
            <Sidebar />
            <main className="sm:w-2/3 xl:w-4/5 sm:min-h-screen p-5">
              <Header />
              {children}
            </main>
          </div>
        </div>
      )}
    </>
  );
}
