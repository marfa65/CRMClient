import React from "react";
import Swal from "sweetalert2";
import { gql, useMutation } from "@apollo/client";
import Router from "next/router";

const ELIMINAR_CLIENTE = gql`
  mutation eliminarCliente($id: ID!) {
    eliminarCliente(id: $id)
  }
`;

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

const Cliente = ({ cliente }) => {
  const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE, {
    update(cache) {
      //obtener copia del objeto de cache
      const { obtenerClientesVendedor } = cache.readQuery({
        query: OBTENER_CLIENTES_USUARIO,
      });

      //reescribir el cache
      cache.writeQuery({
        query: OBTENER_CLIENTES_USUARIO,
        data: {
          obtenerClientesVendedor: obtenerClientesVendedor.filter(
            (cliente) => cliente.id !== id
          ),
        },
      });
    },
  });
  const { nombre, apellido, empresa, email, id } = cliente;

  const confirmarEliminarCliente = () => {
    Swal.fire({
      title: `Deseas eliminar el cliente: ${nombre} ${apellido}???`,
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
      cancelButtonText: "No, Cancelar",
      confirmButtonText: "Si, Eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // eliminar por id
          const { data } = await eliminarCliente({
            variables: { id },
          });
          Swal.fire("Cliente eliminado!", `${nombre} ${apellido}`, "success");
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const editarCliente = (id) => {
    Router.push({
      pathname: "/editarcliente/[id]",
      query: { id },
    });
  };
  // console.log("id cliente", id);
  return (
    <tr>
      <td className="border px-4 py-2 capitalize">
        {nombre} {apellido}
      </td>
      <td className="border px-4 py-2">{empresa} </td>
      <td className="border px-4 py-2">{email} </td>

      <td className="border px-4 ml-2">
        <button
          type="button"
          className="flex justify-center  items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold transition duration-700 ease-in-out hover:bg-green-400 hover:text-black"
          onClick={() => editarCliente(id)}
        >
          Editar
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
      </td>
      <td className="border px-4 py-2">
        <button
          type="button"
          className="flex justify-center items-center bg-red-700 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold transition duration-700 ease-in-out hover:bg-red-500 hover:text-black"
          onClick={() => confirmarEliminarCliente(id)}
        >
          Eliminar
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </td>
    </tr>
  );
};

export default Cliente;
