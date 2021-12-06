import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";

const OBTENER_USUARIO = gql`
  query obtenerUsuario {
    obtenerUsuario {
      id
      nombre
      apellido
    }
  }
`;

const Header = () => {
  const router = useRouter();

  const { data, loading, error, client } = useQuery(OBTENER_USUARIO);

  //proteger que no accedamos a data antes de tener resultados
  // if (loading) return "cargando..."; // sin esto, data da undefined !!!!

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

  const { nombre, apellido } = data.obtenerUsuario;

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    client.clearStore();
    router.push("/login");
  };

  return (
    <div className="sm:flex sm:justify-between mb-6">
      <p className="mr-2 mb-5 lg:mb-0 text-xl capitalize">
        Hola: {nombre} {apellido}
      </p>
      <button
        onClick={() => cerrarSesion()}
        type="button"
        className="bg-blue-600 w full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shdow-md transition duration-700 ease-in-out hover:bg-gray-800 hover:text-gray-200"
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Header;
