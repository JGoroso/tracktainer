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

// Retornamos una lista de objetos con los pedidos guardados en firestore
export const getPedidos = async () => {
  const coleccionPedidos = query(collection(db, "pedidos"))
  return getDocs(coleccionPedidos)
    .then((response) => {
      const pedidosFromDocs = response.docs.map((prod) => {
        const data = prod.data();
        return { id: prod.id, ...data }
      })
      return pedidosFromDocs;
    })
    .catch((error) => {
      console.log(error)
    })
}

export const getChoferes = async () => {
  const coleccionChoferes = query(collection(db, 'chofer'))
  return getDocs(coleccionChoferes)
    .then((response) => {
      const choferesFromDoc = response.docs.map((prod) => {
        const data = prod.data();
        return { id: prod.id, ...data }
      })
      return choferesFromDoc;
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


// Update chofer del pedido en /Pedidos
export const updateChofer = async (docId, chofer) => {
  await updateDoc(doc(db, "pedidos", docId), {
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