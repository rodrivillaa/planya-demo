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
import "./index.css";

const BarDetail = () => {
  const { id } = useParams();
  const [bar, setBar] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addFavorite, removeFavorite, favorites } = useContext(FavoritesContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const handleToggleFavorite = () => {
    const alreadyInFavorites = favorites.some(fav => fav.id === id);

    if (alreadyInFavorites) {
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

  const handleLocationClick = () => {
    if (bar.latitude && bar.longitude) {
      const mapsUrl = `https://www.google.com/maps?q=${bar.latitude},${bar.longitude}`;
      window.open(mapsUrl, '_blank');
    } else {
      Swal.fire({
        title: 'Ubicación no disponible',
        text: 'No hay coordenadas para este bar',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    Swal.fire({
      title: 'Enlace copiado',
      text: 'El enlace se ha copiado al portapapeles',
      icon: 'success',
      confirmButtonText: 'OK'
    });
    setShowShareOptions(false);
  };

  const shareOnWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`Mira este bar: ${window.location.href}`)}`;
    window.open(url, '_blank');
    setShowShareOptions(false);
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
            <img src={bar.imagenURL || imagen} alt={`Imagen de ${bar.nombre}`} width="200" />
          </div>
          <div className='contenedorIconos'>
            <span  onClick={handleShare}><CiSaveDown2 /></span>
            <span onClick={handleLocationClick}><IoLocationOutline /></span>
          </div>
          <div className='contenedorDescripcion'>
            <h2>Información</h2>
            <p>Descripción: {bar.descripcion}</p>
            <Link to="/zonaeste">
              <button>Volver</button>
            </Link>
          </div>
          <div className='btn-fav'>
            <button onClick={handleToggleFavorite}>
              <FontAwesomeIcon
                icon={faBookmark}
                style={{
                  color: isFavorite ? "#F28C1D" : "gray",
                }}
              />
            </button>
          </div>
          

          {/* Modal de opciones de compartir */}
          {showShareOptions && (
            <div className="modal">
              <div className="modal-content">
                <h3>Compartir</h3>
                <button onClick={shareOnWhatsApp}>Compartir en WhatsApp</button>
                <button onClick={copyLink}>Copiar enlace</button>
                <button onClick={() => setShowShareOptions(false)}>Cerrar</button>
              </div>
            </div>
          )}

        </div>
      ) : (
        <p>No se encontró el bar...</p>
      )}
    </div>
  );
};

export default BarDetail;