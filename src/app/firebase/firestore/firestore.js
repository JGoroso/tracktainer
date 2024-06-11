import {
  getDocs,
  collection,
  query,
  getFirestore,
  deleteDoc,
  doc,
  updateDoc,
  where,
  addDoc,
} from "firebase/firestore"
import app from "../firebase"

export const db = getFirestore(app)

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

export const addUsuario = async (data) => {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      nombre: data.nombre,
      telefono: data.telefono,
      role: data.role,
      email: data.email,
      estado: "activo"
    })
    console.log("Document written with ID: ", docRef.id)
  } catch (e) {
    console.error("Error adding document: ", e)
  }
}

export const getUsuarios = async () => {
  const coleccionUsers = query(collection(db, "users"))
  return getDocs(coleccionUsers)
    .then((response) => {
      const usersFromDocs = response.docs.map((user) => {
        const data = user.data();
        return { id: user.id, ...data }
      })
      return usersFromDocs;
    })
    .catch((error) => {
      console.log(error)
    })
}

// Update estado del usuario a baja
export const updateEstadoUsuario = async (docId) => {
  await updateDoc(doc(db, "users", docId), {
    estado: "baja",
  })
    .then(() => {
      console.log('Documento actualizado exitosamente');

    })
    .catch((error) => {
      console.error('Error al borrar el documento:', error);
    });
}

//
export const updateInfoUsuario = async (docId, data) => {
  await updateDoc(doc(db, "users", docId.id), {
    nombre: data.nombre,
    role: data.role,
    telefono: data.telefono,
    email: data.email
  })
    .then(() => {
      console.log('Documento actualizado exitosamente');

    })
    .catch((error) => {
      console.error('Error al borrar el documento:', error);
    });
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
