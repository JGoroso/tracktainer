import {
  getDoc,
  doc,
  getFirestore,
} from 'firebase/firestore';
import app from '../../../src/app/firebase/firebase';

// Obtén la instancia de Firestore
const db = getFirestore(app);

export default async function handler(req, res) {
  try {
    const { id } = req.query; // Obtener el ID del pedido desde la consulta

    if (!id) {
      return res.status(400).send('ID del pedido es requerido');
    }

    // Crear una referencia al documento del pedido con el ID proporcionado
    const pedidoDoc = doc(db, 'pedidos', id);

    // Obtener el documento del pedido
    const snapshot = await getDoc(pedidoDoc);

    if (!snapshot.exists()) {
      return res.status(404).send('Pedido no encontrado');
    }

    // Extraer los datos del documento
    const data = snapshot.data();
    console.log('Datos del pedido:', data); // Depurar los datos

    // Responder con el pedido en formato JSON
    res.status(200).json({ id: snapshot.id, ...data });
  } catch (error) {
    console.error('Error al obtener el pedido:', error);
    res.status(500).send('Error al obtener el pedido');
  }
}
