import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { useState, useMemo } from "react";
import {
  getPedidos,
  updateEstadoContenedorDisponible,
  updateEstadoPedido,
  updateRemitoPedido,
} from "../firebase/firestore/firestore";
import { useAsync } from "../hooks/useAsync";
import RemitoModal from "./RemitoModal";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import PedidoGuardadoModal from "./PedidoGuardadoModal";

function GoogleMapView() {
  const [markerId, setMarkerId] = useState("");
  const [selected, setSelected] = useState(null);
  const [proximoEstado, setProximoEstado] = useState("");

  const [refresh, setRefresh] = useState(false);
  const [showModalRemito, setShowModalRemito] = useState(false);
  const [showModalGuardado, setShowModalGuardado] = useState(false);

  // 'Cacheamos' con use memo el valor de cba evitando el re render del componente.
  // Esto lo hacemos ya que <GoogleMap> en su propiedad center entiende que debe renderizar el componente
  // CADA VEZ que nos movemos sobre el mapa.
  const center = useMemo(() => ({ lat: -31.408, lng: -64.192 }), []);

  // este handle nos permite cambiar el estado del contenedor una vez apretado el button dentro del pin
  const handleOnClick = (contenedorNro, estado, isPendiente) => {
    const docId = markerId;
    setProximoEstado(estado);
    if (isPendiente) {
      setShowModalRemito(true); // Mostrar el modal en caso de que se pendiente
    } else {
      // Actualiza el campo Estado a Completado en Firestore

      updateEstadoPedido(docId, estado);
      if (estado == "completado") {
        updateEstadoContenedorDisponible(contenedorNro);
      }
      setShowModalGuardado(true);

      setTimeout(() => {
        setShowModalGuardado(false);
        setSelected(null);
        setRefresh(!refresh);
      }, 1000);
    }
  };

  // Se llama a la funcion getPedidos que nos devuelve todos los objetos de la coleccion 'Pedidos' en forma de promesa
  const getPedidosFromFirestore = () => getPedidos();
  // Utilizamos un hook que hara un async await al que le pasamos una funcion asincrona que retorna una promesa (get docs from firestore)
  // podremos recibir la data utilizando un useEffect (y con el refresh podemos refrescar los datos) y luego utilizar estos datos donde queramos
  const { data } = useAsync(getPedidosFromFirestore, refresh);
  const containerStyle = {
    width: "100%",
    height: "90vh",
  };

  const handleGuardarRemito = (nroRemito) => {
    const docId = markerId;
    if (nroRemito) {
      // entregado es el proximo estado luego de pendiente
      updateEstadoPedido(docId, "entregado");
      updateRemitoPedido(docId, nroRemito);
      setShowModalRemito(false);
      setShowModalGuardado(true);
      setTimeout(() => {
        setSelected(null);
        setRefresh(!refresh);
        setShowModalGuardado(false);
      }, 3000);
    } else {
      alert("Inserte nro remito");
    }
  };

  return (
    <>
      <div>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          options={{
            mapId: "4fe06d8ce7103950",
            disableDefaultUI: true,
            clickableIcons: false,
            gestureHandling: "greedy",
          }}
        >
          {data &&
            data.map((marker) =>
              marker["estado"] == "pendiente" ||
                marker["estado"] == "entregado" ||
                marker["estado"] == "retirar" ? (
                <Marker
                  key={marker.id}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  icon={
                    marker["estado"] === "pendiente"
                      ? { url: "/cont-pend.png" }
                      : marker["estado"] === "entregado"
                        ? { url: "/cont-entre.png" }
                        : { url: "/cont-retirar.png" }
                  }
                  onClick={() => {
                    setSelected(marker);
                    setMarkerId(marker.id);
                  }}
                />
              ) : null
            )}
          {selected ? (
            <div className="max-h-96">
              <InfoWindow
                position={{ lat: selected.lat, lng: selected.lng }}
                onCloseClick={() => setSelected(null)}
              >
                <div className="relative overflow-hidden flex flex-col justify-between space-y-4 text-sm rounded-xl max-w-[23rem] p-4 bg-white text-slate-700 shadow-lg">
                  <div className="flex justify-between items-center">
                    <div
                      className={`uppercase text-xs font-semibold ${selected.estado === "pendiente" ? "text-yellow-500" : selected.estado === "entregado" ? "text-green-400" : selected.estado === "retirar" ? "text-orange-400" : selected.estado === "completado" ? "text-blue-500" : ""}`}
                    >
                      {selected.estado}
                    </div>
                    <div className="flex items-center">
                      {selected.estado !== "pendiente" ? (
                        <>
                          <ClockIcon className="h-6 w-6 text-gray-500" />
                          <p className="text-gray-700">
                            Días en sitio:{" "}
                            {Math.max(
                              Math.floor(
                                (new Date() -
                                  new Date(
                                    new Date(
                                      selected.fechaPedido
                                    ).toLocaleString("en-US", {
                                      timeZone:
                                        "America/Argentina/Buenos_Aires",
                                    })
                                  )) /
                                (1000 * 60 * 60 * 24)
                              ),
                              0 // Ensure the result is non-negative
                            )}
                          </p>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="h-32 w-full rounded-lg overflow-hidden">
                      <iframe
                        className="w-full h-full"
                        src={`https://maps.google.com/maps?q=${selected.lat},${selected.lng}&z=15&output=embed`}
                      ></iframe>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center space-x-2 mt-2">
                      <MapPinIcon className="h-4 w-4 text-gray-900 font-bold" />
                      <p className="text-gray-700"> {selected.direccion} </p>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <TruckIcon className="h-4 w-4 text-gray-900 font-bold" />
                      <p className="text-gray-900 font-bold">Chofer </p>
                      <p className="text-gray-700"> {selected.chofer} </p>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <TruckIcon className="h-4 w-4 text-gray-900 font-bold" />
                      <p className="text-gray-900 font-bold">Contenedor </p>
                      <p className="text-gray-700"> {selected.contenedor} </p>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <CalendarDaysIcon className="h-4 w-4 text-gray-900 font-bold" />
                      <p className="text-gray-900 font-bold">
                        Fecha de entrega{" "}
                      </p>
                      <p className="text-gray-700"> {selected.fechaPedido} </p>
                    </div>
                  </div>

                  <div
                    className="flex flex-col 
               md:space-x-2 space-y-2 md:space-y-0 gap-2"
                  >
                    <button
                      onClick={() => {
                        selected.estado === "pendiente"
                          ? handleOnClick(
                            selected.contenedor,
                            "entregado",
                            true
                          )
                          : selected.estado === "entregado"
                            ? handleOnClick(
                              selected.contenedor,
                              "retirar",
                              false
                            )
                            : selected.estado === "retirar"
                              ? handleOnClick(
                                selected.contenedor,
                                "completado",
                                false
                              )
                              : null;
                      }}
                      className={`flex items-center justify-center px-4 py-2 text-sm text-white 
                      ${selected.estado === "pendiente"
                          ? "bg-green-500 hover:bg-green-600"
                          : selected.estado === "entregado"
                            ? "bg-orange-500 hover:bg-orange-600"
                            : selected.estado === "retirar"
                              ? "bg-blue-500 hover:bg-blue-600"
                              : null
                        } rounded-lg transition duration-200`}
                    >
                      {selected.estado === "pendiente"
                        ? "Entregado"
                        : selected.estado === "entregado"
                          ? "Retirado"
                          : selected.estado === "retirar"
                            ? "Completado"
                            : null}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5 ml-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setSelected(null)}
                      className="flex items-center justify-center px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-200"
                    >
                      Cerrar
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5 ml-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </InfoWindow>
            </div>
          ) : null}
        </GoogleMap>
      </div>
      <RemitoModal
        show={showModalRemito}
        onClose={() => setShowModalRemito(false)}
        onSave={handleGuardarRemito}
      />
      <PedidoGuardadoModal
        show={showModalGuardado}
        message={`Su pedido ha pasado a estado ${proximoEstado}`}
      />
    </>
  );
}

export default GoogleMapView;
