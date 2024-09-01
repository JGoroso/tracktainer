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


    // Obtener la fecha de inicio y fin del mes actual como cadenas en formato YYYY-MM-DD
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Agrega un cero inicial si es necesario

    const startOfMonth = `${year}-${month}-01`;
    const endOfMonthDate = new Date(year, now.getMonth() + 1, 0); // Último día del mes actual
    const endOfMonth = `${year}-${month}-${String(endOfMonthDate.getDate()).padStart(2, '0')}`;

    // Crear una consulta para filtrar por 'estado' igual a 'completado'
    // y por el rango de fechas del mes actual
    const pedidoCompletadoQuery = query(
      pedidosCollection,
      where('estado', '==', 'completado'),
      where('fechaPedido', '>=', startOfMonth),
      where('fechaPedido', '<=', endOfMonth)
    );

    // Obtener los documentos que cumplen con la consulta
    const snapshot = await getDocs(pedidoCompletadoQuery);

    // Obtener el total de pedidos completados en el mes actual
    const totalPedidos = snapshot.docs.length;

    // Responder con el total en formato JSON
    res.status(200).json({ totalPedidos });
  } catch (error) {
    console.error('Error al obtener los pedidos completados del mes:', error);
    res.status(500).send('Error al obtener los pedidos completados del mes');
  }
}

