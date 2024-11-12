import React, { useEffect, useState,  useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import "./bardetail.css"
import { CiSaveDown2 } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import imagen from "../../../assets/images/imagen.png"
import { FavoritesContext } from '../../../../context/FavoritesContext';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const BarDetail = () => {
  const { id } = useParams(); // Extrae el id desde la URL
  const [bar, setBar] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para controlar el mensaje de carga
  const { addFavorite } = useContext(FavoritesContext);
  const [isFavorite, setIsFavorite] = useState(false); // Estado para el color del ícono

  const handleAddFavorite = () => {
    // Crear un nuevo objeto que incluya el ID
    const barConID = {
      ...bar,
      id: id, // Añadir el ID que obtuvimos de useParams
      nombre: bar.nombre,
      imagenURL: bar.imagenURL || imagen,
      ubicacion: bar.direccion
    };

    console.log('Bar a agregar a favoritos:', barConID); // Para debugging
    addFavorite(barConID);
    setIsFavorite(!isFavorite); // Cambia el estado al hacer clic
  };

  useEffect(() => {
    const fetchBarDetail = async () => {
      const barDoc = doc(db, "bares", id);
      const barSnapshot = await getDoc(barDoc);
      if (barSnapshot.exists()) {
        // Guardar los datos incluyendo el ID
        setBar({
          id: barSnapshot.id, // Incluir el ID del documento
          ...barSnapshot.data()
        });
      } else {
        console.log("No se encontró el bar");
      }
      setLoading(false);
    };

    fetchBarDetail();
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
            <span>Desde ${bar.precio}</span>
            <p>Horarios 12pm -  6am</p>
            <p>Dias:  Viernes a Domingo</p>
          </div>

          <div className='contenedorImagen'>
          {bar.imagenURL ? (
                    <img
                      src={bar.imagenURL}
                      alt={`Imagen de ${bar.nombre}`}
                      width="200"
                    />
                  ) : (
                    <img src={imagen} alt="Imagen no encontrada" width="200" />
                  )}
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
<div className='btn-fav'>

          <button onClick={handleAddFavorite}><FontAwesomeIcon icon={faBookmark}  style={{ 
      color: isFavorite ? "#F28C1D" : "gray", 
      
      borderColor: isFavorite ? "yellow" : "black", 
      borderRadius: "4px", // Opcional: redondea el borde
    
    }}  /></button>
</div>

            
            
            
            
          
        </div>
        
    ) : ( 
        <p>no se encontro el bar...</p>
    )}
    </div>
);
};

export default BarDetail;