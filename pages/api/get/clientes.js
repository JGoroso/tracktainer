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
    // Crear una referencia a la colección 'clientes'
    const clientesCollection = collection(db, 'clientes');

    // Obtenemos todos los contenedores
    const clientesQuery = query(clientesCollection);

    // Obtener los documentos que cumplen con la consulta
    const snapshot = await getDocs(clientesQuery);

    // Mapear los documentos a un array de objetos
    const clientes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Responder con la lista de clientes en formato JSON
    res.status(200).json(clientes);
  } catch (error) {
    console.error('Error al obtener los clientes:', error);
    res.status(500).send('Error al obtener los clientes');
  }
}

