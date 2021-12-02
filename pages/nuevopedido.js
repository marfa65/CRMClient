import React, { useContext, useState } from "react";
import Layout from "../components/Layout";
import AsignarCliente from "../components/pedidos/AsignarCliente";
import AsignarProductos from "../components/pedidos/AsignarProductos";
import ResumenPedido from "../components/pedidos/ResumenPedido";
import Total from "../components/pedidos/Total";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

// Context de pedidos
import PedidoContext from "../context/pedidos/PedidoContext";

const NUEVO_PEDIDO = gql`
  mutation nuevoPedido($input: PedidoInput) {
    nuevoPedido(input: $input) {
      id
    }
  }
`;

const OBTENER_PEDIDOS = gql`
  query obtenerPedidosVendedor {
    obtenerPedidosVendedor {
      id
      pedido {
        id
        cantidad
        nombre
      }
      cliente {
        id
        nombre
        apellido
        email
        telefono
      }
      vendedor
      total
      estado
    }
  }
`;

const NuevoPedido = () => {
  const router = useRouter();

  const [mensaje, setMensaje] = useState(null);

  // Utilizar context y extraer sus funciones y valores
  const pedidoContext = useContext(PedidoContext);
  const { cliente, productos, total } = pedidoContext;

  // Mutation para crear un nuevo pedido
  const [nuevoPedido] = useMutation(NUEVO_PEDIDO, {
    update(cache, { data: { nuevoPedido } }) {
      const { obtenerPedidosVendedor } = cache.readQuery({
        query: OBTENER_PEDIDOS,
      });
      cache.writeQuery({
        query: OBTENER_PEDIDOS,
        data: {
          obtenerPedidosVendedor: [...obtenerPedidosVendedor, nuevoPedido],
        },
      });
    },
  }); // ACTUALIZAR EL CACHE

  const validarPedido = () => {
    return !productos.every((producto) => producto.cantidad > 0) ||
      total === 0 ||
      cliente.length === 0
      ? " opacity-50 cursor-not-allowed "
      : "";
  };

  const crearNuevoPedido = async () => {
    const { id } = cliente;

    // Remover lo no deseado de productos
    const pedido = productos.map(
      ({ __typename, existencia, ...producto }) => producto
    );

    try {
      const { data } = await nuevoPedido({
        variables: {
          input: {
            cliente: id,
            total,
            pedido,
          },
        },
      });

      // Redireccionar
      router.push("/pedidos");

      // Mostrar alerta
      Swal.fire("Correcto", "El pedido se registró correctamente", "success");
    } catch (error) {
      setMensaje(error.message.replace("GraphQL error: ", ""));

      setTimeout(() => {
        setMensaje(null);
      }, 3000);
    }
  };

  const mostrarMensaje = () => {
    return (
      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto ">
        <p>{mensaje} </p>
      </div>
    );
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-normal underline">
        Crear Nuevo Pedido
      </h1>

      {mensaje && mostrarMensaje()}

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <AsignarCliente />
          <AsignarProductos />
          <ResumenPedido />
          <Total />

          <button
            type="button"
            className={` bg-gray-800 w-full mt-5 p-2 text-white rounded uppercase font-bold  ${validarPedido()}  transition duration-700 ease-in-out hover:bg-green-600  hover:text-black`}
            onClick={() => crearNuevoPedido()}
          >
            Registrar Pedido
          </button>
          <button
            type="button"
            className="flex justify-center items-center mt-5 w-full bg-red-700 py-2 px-4 w-auto text-white rounded text-xs uppercase font-bold transition duration-700 ease-in-out hover:bg-red-500 hover:text-black"
            onClick={() => router.push("/pedidos")}
          >
            Cancelar - Volver
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 ml-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
              />
            </svg>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default NuevoPedido;
