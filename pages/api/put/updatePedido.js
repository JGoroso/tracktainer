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
      const { data, pedidoId } = req.body;

      if (!pedidoId) {
        return res.status(400).json({ error: 'ID del pedido es requerido' });
      }

      const pedidoDocRef = doc(db, 'pedidos', pedidoId);

      await updateDoc(pedidoDocRef, {
        chofer: data.chofer,
        cliente: data.cliente,
        contenedor: data.contenedor,
        direccion: data.direccion,
        fechaPedido: data.fechaPedido,
        lat: data.latitude,
        lng: data.longitude,
        recibe: data.recibe,
        telefono: data.telefono,
      });

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