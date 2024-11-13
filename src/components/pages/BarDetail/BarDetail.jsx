import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { CiSaveDown2 } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import imagen from "../../../assets/images/imagen.png";
import { FavoritesContext } from '../../../../context/FavoritesContext';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';

const BarDetail = () => {
  const { id } = useParams();
  const [bar, setBar] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addFavorite, removeFavorite, favorites } = useContext(FavoritesContext);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleToggleFavorite = () => {
    const alreadyInFavorites = favorites.some(fav => fav.id === id);

    if (alreadyInFavorites) {
      // Quitar de favoritos
      removeFavorite(id);
      localStorage.removeItem(id);
      setIsFavorite(false);
      Swal.fire({
        title: 'Eliminado',
        text: 'El bar se ha eliminado de favoritos',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } else {
      // Agregar a favoritos
      const barConID = {
        ...bar,
        id: id,
        nombre: bar.nombre,
        imagenURL: bar.imagenURL || imagen,
        ubicacion: bar.direccion
      };
      addFavorite(barConID);
      localStorage.setItem(id, JSON.stringify(barConID));
      setIsFavorite(true);
      Swal.fire({
        title: 'Agregado',
        text: 'El bar se ha agregado a favoritos',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    }
  };

  useEffect(() => {
    const fetchBarDetail = async () => {
      const barDoc = doc(db, "bares", id);
      const barSnapshot = await getDoc(barDoc);
      if (barSnapshot.exists()) {
        setBar({
          id: barSnapshot.id,
          ...barSnapshot.data()
        });

        // Verificar en localStorage si ya está en favoritos
        const savedFavorite = localStorage.getItem(id);
        if (savedFavorite) {
          setIsFavorite(true);
        }
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
      ) : bar ? (
        <div>
          <div className='contenedorTitulo'>
            <h1>BOLICHE - {bar.nombre}</h1>
          </div>

          <div className='contenedorPrecioHorario'>
            <span>Desde ${bar.precio}</span>
            <p>Horarios 12pm - 6am</p>
            <p>Días: Viernes a Domingo</p>
          </div>

          <div className='contenedorImagen'>
            {bar.imagenURL ? (
              <img src={bar.imagenURL} alt={`Imagen de ${bar.nombre}`} width="200" />
            ) : (
              <img src={imagen} alt="Imagen no encontrada" width="200" />
            )}
          </div>

          <div className='contenedorIconos'>
            <span><CiSaveDown2 /></span>
            <span><IoLocationOutline /></span>
          </div>

          <div className='contenedorDescripcion'>
            <h2>Información</h2>
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
            <h2>Ubicación</h2>
            <p>Dirección: {bar.direccion}</p>
          </div>

          <div className='btn-fav'>
            <button onClick={handleToggleFavorite}>
              <FontAwesomeIcon
                icon={faBookmark}
                style={{
                  color: isFavorite ? "#F28C1D" : "gray",
                  borderColor: isFavorite ? "yellow" : "black",
                  borderRadius: "4px"
                }}
              />
            </button>
          </div>
        </div>
      ) : (
        <p>No se encontró el bar...</p>
      )}
    </div>
  );
};

export default BarDetail;