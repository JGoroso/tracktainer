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

export const getClientes = async () => {
  const coleccionClientes = query(collection(db, "clientes"))
  return getDocs(coleccionClientes)
    .then((response) => {
      const clientesFromDoc = response.docs.map((user) => {
        const data = user.data();
        return { id: user.id, ...data }
      })
      return clientesFromDoc;
    })
    .catch((error) => {
      console.log(error)
    })
}

export const addCliente = async (data) => {
  try {
    const docRef = await addDoc(collection(db, "clientes"), {
      empresa: data.nombreEmpresa,
      referente: data.nombreCompleto,
      telefono: data.telefono,
      estado: "activo"
    })
    console.log("Document written with ID: ", docRef.id)
  } catch (e) {
    console.error("Error adding document: ", e)
  }
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

export const updateEstadoCliente = async (docId) => {
  await updateDoc(doc(db, "clientes", docId), {
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

export const updateInfoCliente = async (docId, data) => {
  await updateDoc(doc(db, "clientes", docId.id), {
    empresa: data.nombreEmpresa,
    referente: data.nombreCompleto,
    telefono: data.telefono
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

export const fetchOrdersByDateRange = async (startDateStr, endDateStr, estado) => {

  const ordersCollection = collection(db, 'pedidos');
  var q
  if (!estado) {
    q = query(
      ordersCollection,
      where('fechaPedido', '>=', startDateStr),
      where('fechaPedido', '<=', endDateStr)
    )
  } else {
    q = query(
      ordersCollection,
      where('fechaPedido', '>=', startDateStr),
      where('fechaPedido', '<=', endDateStr),
      where('estado', '==', estado)
    )
  }


  const ordersSnapshot = await getDocs(q);
  const ordersList = ordersSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  return ordersList;
};

export const fetchOrders = async (startDate, endDate, estado) => {
  return await fetchOrdersByDateRange(startDate, endDate, estado);
};
