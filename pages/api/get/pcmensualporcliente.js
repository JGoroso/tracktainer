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

    // Obtener la fecha de inicio y fin del mes actual como cadenas en formato YYYY-MM-DD
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Agrega un cero inicial si es necesario

    const startOfMonth = `${year}-${month}-01`;
    const endOfMonthDate = new Date(year, now.getMonth() + 1, 0); // Último día del mes actual
    const endOfMonth = `${year}-${month}-${String(endOfMonthDate.getDate()).padStart(2, '0')}`;

    // Filtrar los pedidos que tienen el estado "completado" y están en el mes actual
    const pedidosQuery = query(
      pedidosCollection,
      where('estado', '==', 'completado'),
      where('fechaPedido', '>=', startOfMonth),
      where('fechaPedido', '<=', endOfMonth)
    );

    // Obtener los documentos que cumplen con la consulta
    const snapshot = await getDocs(pedidosQuery);

    // Mapear los documentos a un array de objetos
    const pedidos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Calcular el total de pedidos completados en el mes actual
    const totalPedidos = pedidos.length;

    // Crear un objeto para contar los pedidos por cliente
    const pedidosPorCliente = {};

    // Contar los pedidos por cliente
    pedidos.forEach(pedido => {
      const cliente = pedido.cliente;
      if (!pedidosPorCliente[cliente]) {
        pedidosPorCliente[cliente] = 0;
      }
      pedidosPorCliente[cliente]++;
    });

    // Calcular el porcentaje de pedidos por cliente
    const porcentajesPorCliente = Object.entries(pedidosPorCliente).map(([cliente, count]) => ({
      cliente,
      porcentaje: ((count / totalPedidos) * 100).toFixed(2), // Convertir a porcentaje con dos decimales
    }));

    // Responder con los porcentajes en formato JSON
    res.status(200).json(porcentajesPorCliente);
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    res.status(500).send('Error al obtener los pedidos');
  }
}
