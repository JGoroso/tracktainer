import {
  getDocs,
  collection,
  query,
  getFirestore,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore"
import app from "../firebase"

const db = getFirestore(app)

// Retornamos una lista de objeto con los datos de firestore de manera asincrona
export const getContainers = async () => {
  const coleccionPedidos = query(collection(db, "pedidos"))

  return getDocs(coleccionPedidos)
    .then((response) => {
      const containersFromDocs = response.docs.map((prod) => {
        const data = prod.data();
        return { id: prod.id, ...data }
      })
      return containersFromDocs;
    })
    .catch((error) => {
      console.log(error)
    })
}

// Borramos un pedido
export const deletePedido = async (docId) => {
  await deleteDoc(doc(db, 'pedidos', docId))
    .then(() => {
      console.log('Documento borrado exitosamente');
    })
    .catch((error) => {
      console.error('Error al borrar el documento:', error);
    });
}


// Update pedido from /Pedidos
export const updatePedido = async (docId, chofer, idContenedor, estado) => {
  await updateDoc(doc(db, "pedidos", docId), {
    estado: estado,
    idContenedor: idContenedor,
    chofer: chofer
  })
    .then(() => {
      console.log('Documento actualizado exitosamente');
    })
    .catch((error) => {
      console.error('Error al borrar el documento:', error);
    });
}

// Update estado del pedido

export const updateEstadoPedido = async (docId, estado) => {
  await updateDoc(doc(db, "pedidos", docId), {
    estado: estado,
  })
    .then(() => {
      console.log('Documento actualizado exitosamente');
  
    })
    .catch((error) => {
      console.error('Error al borrar el documento:', error);
    });
}