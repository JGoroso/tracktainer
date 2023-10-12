import {
  getDocs,
  collection,
  query,
  getFirestore,
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