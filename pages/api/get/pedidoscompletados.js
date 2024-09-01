import {
  getDocs,
  collection,
  query,
  where,
  getFirestore,
  Timestamp,
} from 'firebase/firestore';
import app from '../../../src/app/firebase/firebase';

// Obtén la instancia de Firestore
const db = getFirestore(app);

export default async function handler(req, res) {
  try {
    // Crear una referencia a la colección 'pedidos'
    const pedidosCollection = collection(db, 'pedidos');

    // Obtener parámetros de fecha
    const { month, year } = req.query;

    // Obtener la fecha de inicio y fin del mes y del año
    const startOfMonth = new Date(year, month - 1, 1); // El primer día del mes
    const endOfMonth = new Date(year, month, 0); // El último día del mes

    // Convertir a Timestamp para Firestore
    const startTimestamp = Timestamp.fromDate(startOfMonth);
    const endTimestamp = Timestamp.fromDate(endOfMonth);

    // Crear una consulta para filtrar por 'estado' igual a 'completado'
    // y por el rango de fechas especificado
    const pedidoCompletadoQuery = query(
      pedidosCollection,
      where('estado', '==', 'completado'),
      where('fecha', '>=', startTimestamp),
      where('fecha', '<=', endTimestamp)
    );

    // Obtener los documentos que cumplen con la consulta
    const snapshot = await getDocs(pedidoCompletadoQuery);

    // Mapear los documentos a un array de objetos
    const pedidoCompletados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Responder con la lista en formato JSON
    res.status(200).json(pedidoCompletados);
  } catch (error) {
    console.error('Error al obtener los pedidos completados:', error);
    res.status(500).send('Error al obtener los pedidos completados');
  }
}
