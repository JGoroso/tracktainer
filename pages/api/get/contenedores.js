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
    // Crear una referencia a la colección 'contenedores'
    const contenedoresCollection = collection(db, 'contenedores');

    // Obtenemos todos los contenedores
    const contenedoresQuery = query(contenedoresCollection);

    // Obtener los documentos que cumplen con la consulta
    const snapshot = await getDocs(contenedoresQuery);

    // Mapear los documentos a un array de objetos
    const contenedores = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Responder con la lista de contenedores en formato JSON
    res.status(200).json(contenedores);
  } catch (error) {
    console.error('Error al obtener los contenedores:', error);
    res.status(500).send('Error al obtener los contenedores');
  }
}

