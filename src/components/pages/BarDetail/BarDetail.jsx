import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import "./bardetail.css"
import { CiSaveDown2 } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";

const BarDetail = () => {
  const { id } = useParams(); // Extrae el id desde la URL
  const [bar, setBar] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para controlar el mensaje de carga

  useEffect(() => {
    const fetchBarDetail = async () => {
      const barDoc = doc(db, "bares", id);
      const barSnapshot = await getDoc(barDoc);
      if (barSnapshot.exists()) {
        setBar(barSnapshot.data());
      } else {
        console.log("No se encontró el bar");
      }
    };

    fetchBarDetail();

        // Configura un timeout para el mensaje de carga
        const timeoutId = setTimeout(() => {
          setLoading(false);
        }, 1000); // 3 segundos
    
        // Limpia el timeout cuando se desmonta el componente
        return () => clearTimeout(timeoutId);

  }, [id]);




return (

    <div className='ContenedorDetallesPadreTotal'>

      {loading ? (
        <p className="loading">Cargando detalles del bar...</p>
      ) :bar ? (

        <div>

          <div className='contenedorTitulo'>
            <h1>BOLICHE - {bar.nombre}</h1>
          </div>


          <div className='contenedorPrecioHorario'>
            <span>Desde $5000</span>
            <p>Horarios 12pm -  6am</p>
            <p>Dias:  Viernes a Domingo</p>
          </div>

          <div className='contenedorImagen'>
            {bar.imagenURL && <img src={bar.imagenURL} alt={`Imagen de ${bar.nombre}`} width="400" />}
          </div>

          <div className='contenedorIconos'>
            <span><CiSaveDown2 /></span>
            <span><IoLocationOutline /></span>
          </div>

          <div className='contenedorDescripcion'>
            <h2>Informacion</h2>
            <p>Descripción: {bar.descripcion}</p>
            <Link to="/zonaeste">
              <button>Volver</button>
            </Link>
          </div>

          <div className='contenedorPreciosBotellas'>
            <h2>Precios Botellas</h2>
            <p>Smirnoff - $40k</p>
            <p>Speed - $9k</p>
            <p>Corona - $10k</p>
          </div>

          <div className='contenedorUbicacion'>
            <h2>Ubicacion</h2>
            <p>Dirección: {bar.direccion}</p>
          </div>

            
            
            
            
          
        </div>
        
    ) : ( 
        <p>no se encontro el bar...</p>
    )}
    </div>
);
};

export default BarDetail;