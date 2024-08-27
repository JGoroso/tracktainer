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

// Función para formatear la fecha en formato D/M/Y
const formatDate = (dateString) => {
  const [year, month, day] = dateString.split('-');
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
};

export default async function handler(req, res) {
  try {
    // Crear una referencia a la colección 'pedidos'
    const pedidosCollection = collection(db, 'pedidos');

    // Crear una consulta para filtrar por 'estado' igual a 'cancelado'
    const pedidosCanceladosQuery = query(pedidosCollection, where('estado', '==', 'cancelado'));

    // Obtener los documentos que cumplen con la consulta
    const snapshot = await getDocs(pedidosCanceladosQuery);

    // Mapear los documentos a un array de objetos
    const pedidosCancelados = snapshot.docs.map(doc => doc.data());

    // Crear un objeto para contar los pedidos por fecha
    const pedidosPorFecha = {};

    pedidosCancelados.forEach(pedido => {
      const fecha = formatDate(pedido.fechaPedido); // Formatear la fecha
      if (pedidosPorFecha[fecha]) {
        pedidosPorFecha[fecha]++;
      } else {
        pedidosPorFecha[fecha] = 1;
      }
    });

    // Convertir el objeto en un array de objetos con el formato deseado
    const resultado = Object.keys(pedidosPorFecha).map((fecha, index) => ({
      id: index + 1, // Puedes usar un ID único generado de otra manera si es necesario
      fechaPedido: fecha,
      cantidad: pedidosPorFecha[fecha]
    }));

    // Responder con la lista en formato JSON
    res.status(200).json(resultado);
  } catch (error) {
    console.error('Error al obtener los pedidos cancelados:', error);
    res.status(500).send('Error al obtener los pedidos cancelados');
  }
}
