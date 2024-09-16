import {
  getDocs,
  collection,
  query,
  where,
  getFirestore,
} from 'firebase/firestore';
import app from '../../../src/app/firebase/firebase';

// Obtén la instancia de Firestore
const db = getFirestore(app);

export default async function handler(req, res) {
  try {
    // Crear una referencia a la colección 'pedidos'
    const pedidosCollection = collection(db, 'pedidos');

    // Obtenemos todos los pedidos
    const pedidosQuery = query(pedidosCollection);

    // Obtener los documentos que cumplen con la consulta
    const snapshot = await getDocs(pedidosQuery);

    // Mapear los documentos a un array de objetos
    const pedidos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Responder con la lista de pedidos en formato JSON
    res.status(200).json(pedidos);
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    res.status(500).send('Error al obtener los pedidos');
  }
}

