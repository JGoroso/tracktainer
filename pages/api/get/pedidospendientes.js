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

    // Crear una consulta para filtrar por 'estado' igual a 'pendiente'
    const pedidosPendientesQuery = query(pedidosCollection, where('estado', '==', 'pendiente'));

    // Obtener los documentos que cumplen con la consulta
    const snapshot = await getDocs(pedidosPendientesQuery);

    // Mapear los documentos a un array de objetos
    const pedidosPendientes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Responder con la lista en formato JSON
    res.status(200).json(pedidosPendientes);
  } catch (error) {
    console.error('Error al obtener los pedidos pendientes:', error);
    res.status(500).send('Error al obtener los pedidos pendientes');
  }
}
