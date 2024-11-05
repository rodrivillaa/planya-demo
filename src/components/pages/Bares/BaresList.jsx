// src/components/BaresList.js
import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import "./baresList.css"
import imagen from "../../../assets/images/imagen.png"
console.log(imagen); // Esto debería mostrar la URL de la imagen importada


const BaresList = () => {
  const [bares, setBares] = useState([]); // Estado para guardar los bares
  const [loading, setLoading] = useState(true); // Estado para indicar si está cargando

  useEffect(() => {

    // Función para obtener bares desde Firestore con un timeout
    const fetchBares = async () => {
      setLoading(true); // Inicia el estado de carga
      const baresCollection = collection(db, "bares"); // Referencia a la colección "bares"
      const baresSnapshot = await getDocs(baresCollection); // Obtiene los documentos
      const baresList = baresSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setTimeout(() => {
        setBares(baresList); // Actualiza el estado con la lista de bares después del timeout
        setLoading(false); // Finaliza el estado de carga
      }, 3000); // Tiempo de espera en milisegundos (2 segundos)
    };

    fetchBares(); // Llama a la función al montar el componente
  }, []);

  return (
    <div>
   

      {loading ? (
          <div className="loading-container">
          {/* Reproduce el video de carga */}
          <video src="/public/cargamotion.mp4" autoPlay loop muted width="100" />
        </div>
      ) : (
        <div className='contenedorBares'>

          { bares.map((bar) => (
             
            <div className='subContenedor' key={bar.id}>
              <div className='ImagenBoliche'>
                
              {!bar.imagenURL ? (
                <img src={imagen} alt="Imagen no encontrada" width="200" />
              ) : (
                <img src={bar.imagenURL} alt={`Imagen de ${bar.nombre}`} width="200" />
              )}
              
              </div>

              <div className='contenedorDeImagen'>
                <div className='informacionImagenes'>
                  <h3>{bar.nombre}</h3>
                  <p>{bar.direccion}</p>
                </div>

                <div className='btn-Imagenes'>
                  <Link to={`/bares/${bar.id}`}>
                    <button>Ver Mas</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BaresList;