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

    // Obtener la fecha de inicio del año actual y la fecha actual como cadenas en formato YYYY-MM-DD
    const now = new Date();
    const year = now.getFullYear();

    const startOfYear = `${year}-01-01`; // Primer día del año actual
    const currentDate = `${year}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`; // Fecha actual en formato YYYY-MM-DD

    // Filtrar los pedidos que tienen el estado "completado" y están en el año actual
    const pedidosQuery = query(
      pedidosCollection,
      where('estado', '==', 'completado'),
      where('fechaPedido', '>=', startOfYear),
      where('fechaPedido', '<=', currentDate)
    );

    // Obtener los documentos que cumplen con la consulta
    const snapshot = await getDocs(pedidosQuery);

    // Obtener el total de pedidos completados en el mes actual
    const totalPedidos = snapshot.docs.length;

    // Responder con el total en formato JSON
    res.status(200).json({ totalPedidos });
  } catch (error) {
    console.error('Error al obtener los pedidos completados del mes:', error);
    res.status(500).send('Error al obtener los pedidos completados del mes');
  }
}

