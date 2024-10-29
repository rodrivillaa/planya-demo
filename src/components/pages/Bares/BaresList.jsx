// src/components/BaresList.js
import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const BaresList = () => {
  const [bares, setBares] = useState([]); // Estado para guardar los bares

  useEffect(() => {
    // Función para obtener bares desde Firestore
    const fetchBares = async () => {
      const baresCollection = collection(db, "bares"); // Referencia a la colección "bares"
      const baresSnapshot = await getDocs(baresCollection); // Obtiene los documentos
      const baresList = baresSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBares(baresList); // Actualiza el estado con la lista de bares
    };

    fetchBares(); // Llama a la función al montar el componente
  }, []);


  return (
    <div>
      <h1>Bares en Buenos Aires</h1>
      <ul>
        {bares.map((bar) => (

        <li key={bar.id}>
            <h2>{bar.nombre}</h2>
            <p>{bar.direccion}</p>
            {bar.imagenURL ? (
              <img src={bar.imagenURL} alt={`Imagen de ${bar.nombre}`} width="200" />
            ) : (
              <p>Imagen no disponible</p>
            )}
            <Link to={`/bares/${bar.id}`}>
              <button>Ver Descripción</button>
            </Link>
        </li>
        
        ))}
      </ul>
    </div>
  );
};

export default BaresList;