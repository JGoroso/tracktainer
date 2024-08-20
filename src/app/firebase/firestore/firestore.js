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
} from "firebase/firestore";
import app from "../firebase";

export const db = getFirestore(app);

// Retornamos una lista de objetos con los pedidos guardados en firestore
export const getPedidos = async () => {
  const coleccionPedidos = query(collection(db, "pedidos"));
  return getDocs(coleccionPedidos)
    .then((response) => {
      const pedidosFromDocs = response.docs.map((prod) => {
        const data = prod.data();
        return { id: prod.id, ...data };
      });
      return pedidosFromDocs;
    })
    .catch((error) => {
      console.log(error);
    });
};

// solo los contenedores disponibles
export const getContenedores = async () => {
  const contenedoresCollectionRef = query(
    collection(db, "contenedores"),
    where("estado", "==", "disponible")
  );
  try {
    const response = await getDocs(contenedoresCollectionRef);
    const contenedoresFromDoc = response.docs.map((c) => {
      const data = c.data();
      return { value: c.id, ...data };
    });
    return contenedoresFromDoc;
  } catch (error) {
    console.error("Error al cargar los contenedores: ", error);
    throw error;
  }
};

export const getAllContenedores = async () => {
  const contenedoresCollectionRef = query(
    collection(db, "contenedores")
  );
  try {
    const response = await getDocs(contenedoresCollectionRef);
    const contenedoresFromDoc = response.docs.map((c) => {
      const data = c.data();
      return { value: c.id, ...data };
    });
    return contenedoresFromDoc;
  } catch (error) {
    console.error("Error al cargar los contenedores: ", error);
    throw error;
  }
};

// Función para generar un string alfanumérico de 5 caracteres
const generateUniqueNumero = (existingNumeros) => {
  const characters = '0123456789';
  let newNumero;
  do {
    newNumero = '';
    for (let i = 0; i < 5; i++) {
      newNumero += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  } while (existingNumeros.includes(newNumero));
  return 'TT' + newNumero;
};

export const addContenedor = async () => {
  const contenedoresCollectionRef = query(collection(db, "contenedores"));

  try {
    const response = await getDocs(contenedoresCollectionRef);

    const contenedoresFromDoc = response.docs.map((c) => ({
      id: c.id,
      ...c.data()
    }));

    // Obtener todos los números existentes
    const existingNumeros = contenedoresFromDoc.map(contenedor => contenedor.numero);

    // Generar un número único
    const newNumero = generateUniqueNumero(existingNumeros);

    // Agregar el nuevo contenedor con el número generado
    const docRef = await addDoc(collection(db, "contenedores"), {
      estado: "disponible",
      numero: newNumero
    });

    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const getChoferes = async () => {
  const contenedoresCollectionRef = query(
    collection(db, "users"),
    where("role", "==", "chofer")
  );
  try {
    const response = await getDocs(contenedoresCollectionRef);
    const contenedoresFromDoc = response.docs.map((c) => {
      const data = c.data();
      return { value: c.id, label: data.nombre };
    });
    return contenedoresFromDoc;
  } catch (error) {
    console.error("Error al cargar los contenedores: ", error);
    throw error;
  }
};

export const addUsuario = async (data) => {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      nombre: data.nombre,
      telefono: data.telefono,
      role: data.role,
      email: data.email,
      estado: "activo",
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const getUsuarios = async () => {
  const coleccionUsers = query(collection(db, "users"));
  return getDocs(coleccionUsers)
    .then((response) => {
      const usersFromDocs = response.docs.map((user) => {
        const data = user.data();
        return { id: user.id, ...data };
      });
      return usersFromDocs;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getClientes = async () => {
  const coleccionClientes = query(collection(db, "clientes"));
  return getDocs(coleccionClientes)
    .then((response) => {
      const clientesFromDocs = response.docs.map((cliente) => {
        const data = cliente.data();
        return { id: cliente.id, ...data };
      });
      return clientesFromDocs;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const addCliente = async (data) => {
  try {
    const docRef = await addDoc(collection(db, "clientes"), {
      empresa: data.nombreEmpresa,
      referente: data.nombreCompleto,
      telefono: data.telefono,
      estado: "activo",
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// Update estado del usuario a baja
export const updateEstadoUsuario = async (docId) => {
  await updateDoc(doc(db, "users", docId), {
    estado: "baja",
  })
    .then(() => {
      console.log("Documento actualizado exitosamente");
    })
    .catch((error) => {
      console.error("Error al borrar el documento:", error);
    });
};

export const updateEstadoCliente = async (docId) => {
  await updateDoc(doc(db, "clientes", docId), {
    estado: "baja",
  })
    .then(() => {
      console.log("Documento actualizado exitosamente");
    })
    .catch((error) => {
      console.error("Error al borrar el documento:", error);
    });
};

//
export const updateInfoUsuario = async (docId, data) => {
  await updateDoc(doc(db, "users", docId.id), {
    nombre: data.nombre,
    role: data.role,
    telefono: data.telefono,
    email: data.email,
  })
    .then(() => {
      console.log("Documento actualizado exitosamente");
    })
    .catch((error) => {
      console.error("Error al borrar el documento:", error);
    });
};

export const updateInfoCliente = async (docId, data) => {
  await updateDoc(doc(db, "clientes", docId.id), {
    empresa: data.nombreEmpresa,
    referente: data.nombreCompleto,
    telefono: data.telefono,
  })
    .then(() => {
      console.log("Documento actualizado exitosamente");
    })
    .catch((error) => {
      console.error("Error al borrar el documento:", error);
    });
};

// Borramos un pedido
export const deletePedido = async (docId) => {
  await deleteDoc(doc(db, "pedidos", docId))
    .then(() => {
      console.log("Documento borrado exitosamente");
    })
    .catch((error) => {
      console.error("Error al borrar el documento:", error);
    });
};

// Update chofer del pedido en /Pedidos
export const updateChofer = async (docId, chofer) => {
  await updateDoc(doc(db, "pedidos", docId), {
    chofer: chofer,
  })
    .then(() => {
      console.log("Documento actualizado exitosamente");
    })
    .catch((error) => {
      console.error("Error al borrar el documento:", error);
    });
};

// Update estado del pedido
export const updateEstadoPedido = async (docId, estado) => {
  await updateDoc(doc(db, "pedidos", docId), {
    estado: estado,
  })
    .then(() => {
      console.log("Documento actualizado exitosamente");
    })
    .catch((error) => {
      console.error("Error al borrar el documento:", error);
    });
};

// Update estado del pedido
export const updateRemitoPedido = async (docId, nroRemito) => {
  await updateDoc(doc(db, "pedidos", docId), {
    remito: nroRemito,
  })
    .then(() => {
      console.log("Documento actualizado exitosamente");
    })
    .catch((error) => {
      console.error("Error al borrar el documento:", error);
    });
};

// Update estado del contenedor a ocupado
export const updateEstadoContenedorOcupado = async (contNumero) => {
  if (contNumero) {
    try {
      // Creamos una referencia a la colección 'contenedores' y realizamos la consulta filtrando por el número de contenedor
      const contenedoresCollectionRef = collection(db, "contenedores");
      const q = query(contenedoresCollectionRef, where("numero", "==", contNumero));

      // Ejecutamos la consulta para obtener los documentos que coinciden
      const querySnapshot = await getDocs(q);

      // Iteramos sobre los resultados
      querySnapshot.forEach((doc) => {
        // Obtenemos la referencia del documento y actualizamos el campo 'estado' a 'ocupado'
        const contenedorRef = doc.ref; // Accedemos a la referencia del documento con doc.ref
        updateDoc(contenedorRef, {
          estado: "ocupado"
        }).then(() => {
          console.log(`Estado actualizado a "ocupado" para el contenedor con número ${contNumero}`);
        }).catch((error) => {
          console.error("Error actualizando el estado del contenedor:", error);
        });
      });

    } catch (error) {
      console.error("Error obteniendo documentos:", error);
    }
  } else {
    console.log("no se asignaron contenedores")
  }
};

// Update estado del contenedor a disponible
export const updateEstadoContenedorDisponible = async (contNumero) => {
  if (contNumero) {
    try {
      // Creamos una referencia a la colección 'contenedores' y realizamos la consulta filtrando por el número de contenedor
      const contenedoresCollectionRef = collection(db, "contenedores");
      const q = query(contenedoresCollectionRef, where("numero", "==", contNumero));

      // Ejecutamos la consulta para obtener los documentos que coinciden
      const querySnapshot = await getDocs(q);

      // Iteramos sobre los resultados
      querySnapshot.forEach((doc) => {
        // Obtenemos la referencia del documento y actualizamos el campo 'estado' a 'ocupado'
        const contenedorRef = doc.ref; // Accedemos a la referencia del documento con doc.ref
        updateDoc(contenedorRef, {
          estado: "disponible"
        }).then(() => {
          console.log(`Estado actualizado a "disponible" para el contenedor con número ${contNumero}`);
        }).catch((error) => {
          console.error("Error actualizando el estado del contenedor:", error);
        });
      });

    } catch (error) {
      console.error("Error obteniendo documentos:", error);
    }
  } else {
    console.log("no se asignaron contenedores")
  }
};


// Update estado del contenedor a roto
export const updateEstadoContenedorRoto = async (contNumero) => {
  if (contNumero.numero) {
    try {
      // Creamos una referencia a la colección 'contenedores' y realizamos la consulta filtrando por el número de contenedor
      const contenedoresCollectionRef = collection(db, "contenedores");
      const q = query(contenedoresCollectionRef, where("numero", "==", contNumero.numero));

      // Ejecutamos la consulta para obtener los documentos que coinciden
      const querySnapshot = await getDocs(q);

      // Iteramos sobre los resultados
      querySnapshot.forEach((doc) => {
        // Obtenemos la referencia del documento y actualizamos el campo 'estado' a 'ocupado'
        const contenedorRef = doc.ref; // Accedemos a la referencia del documento con doc.ref
        updateDoc(contenedorRef, {
          estado: "roto"
        }).then(() => {
          console.log(`Estado actualizado a "disponible" para el contenedor con número ${contNumero}`);
        }).catch((error) => {
          console.error("Error actualizando el estado del contenedor:", error);
        });
      });

    } catch (error) {
      console.error("Error obteniendo documentos:", error);
    }
  } else {
    console.log("no se asignaron contenedores")
  }
};


export const fetchOrdersByDateRange = async (
  startDateStr,
  endDateStr,
  estado
) => {
  const ordersCollection = collection(db, "pedidos");
  var q;
  if (!estado) {
    q = query(
      ordersCollection,
      where("fechaPedido", ">=", startDateStr),
      where("fechaPedido", "<=", endDateStr)
    );
  } else {
    q = query(
      ordersCollection,
      where("fechaPedido", ">=", startDateStr),
      where("fechaPedido", "<=", endDateStr),
      where("estado", "==", estado)
    );
  }

  const ordersSnapshot = await getDocs(q);
  const ordersList = ordersSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return ordersList;
};

export const fetchOrders = async (startDate, endDate, estado) => {
  return await fetchOrdersByDateRange(startDate, endDate, estado);
};
