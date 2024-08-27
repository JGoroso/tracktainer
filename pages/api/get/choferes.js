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
    // Crear una referencia a la colección 'users'
    const usersCollection = collection(db, 'users');

    // Crear una consulta para filtrar por 'role' igual a 'chofer'
    const choferesQuery = query(usersCollection, where('role', '==', 'chofer'));

    // Obtener los documentos que cumplen con la consulta
    const snapshot = await getDocs(choferesQuery);

    // Mapear los documentos a un array de objetos
    const choferes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Responder con la lista de choferes en formato JSON
    res.status(200).json(choferes);
  } catch (error) {
    console.error('Error al obtener los choferes:', error);
    res.status(500).send('Error al obtener los choferes');
  }
}

