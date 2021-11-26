import Layout from "../components/Layout";
import Cliente from "../components/Cliente";

import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";

const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesVendedor {
    obtenerClientesVendedor {
      id
      nombre
      apellido
      empresa
      email
    }
  }
`;

export default function Index() {
  const router = useRouter();

  // consulta de Apollo
  const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO);
  // console.log(data);
  // console.log(loading);
  // console.log(error);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <div
          className="
          animate-spin
          rounded-full
          h-32
          w-32
          border-t-2 border-b-2 border-purple-500"
        ></div>
      </div>
    );
  }

  if (!data.obtenerClientesVendedor) {
    return router.push("/login");
  }

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-normal">Clientes</h1>
        <Link href="/nuevocliente">
          <a className="bg-blue-700 py-2 px-5 mt-5 inline-block text-white rounded text-sm hover:bg-gray-800 mb-2 uppercase font-bold transition duration-700 ease-in-out hover:bg-gray-800 hover:text-gray-200">
            Nuevo Cliente
          </a>
        </Link>
        <table className="table-auto shadow-md mt-10 w-full w-lg">
          <thead className="bg-gray-700">
            <tr className="text-white">
              <th className="w-1/4 py-2">Nombre</th>
              <th className="w-1/4 py-2">Empresa</th>
              <th className="w-1/4 py-2">Email</th>
              <th className="w-1/8 py-2">Editar</th>
              <th className="w-1/8 py-2">Eliminar</th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {data.obtenerClientesVendedor.map((cliente) => (
              <Cliente key={cliente.id} cliente={cliente} />
            ))}
          </tbody>
        </table>
      </Layout>
    </div>
  );
}
