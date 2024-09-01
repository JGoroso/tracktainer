import {
  doc,
  updateDoc,
  getFirestore,
} from 'firebase/firestore';
import app from '../../../src/app/firebase/firebase';

// Obtén la instancia de Firestore
const db = getFirestore(app);

export default async function handler(req, res) {
  try {
    if (req.method === 'PUT') {
      // Obtener el ID del pedido del cuerpo de la solicitud
      const { pedidoId } = req.body;

      if (!pedidoId) {
        return res.status(400).json({ error: 'ID del pedido es requerido' });
      }

      // Crear una referencia al documento del pedido
      const pedidoDocRef = doc(db, 'pedidos', pedidoId);

      // Actualizar el estado del pedido a 'cancelado'
      await updateDoc(pedidoDocRef, { estado: 'cancelado' });

      // Responder con un mensaje de éxito
      res.status(200).json({ message: 'Pedido actualizado correctamente' });
    } else {
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Método ${req.method} no permitido`);
    }
  } catch (error) {
    console.error('Error al actualizar el pedido:', error);
    res.status(500).send('Error al actualizar el pedido');
  }
}
