import React, { useEffect, useState } from 'react';
import { db } from '../../../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './zonaeste.css';

const ZonaEste = () => {
  const [bares, setBares] = useState([]); // Estado para los bares
  const [ubicacion, setUbicacion] = useState(''); // Estado para la ubicación seleccionada
  const [zona, setZona] = useState(''); // Estado para la zona seleccionada

  useEffect(() => {
    const fetchBares = async () => {
      const baresCollection = collection(db, 'bares');
      const baresSnapshot = await getDocs(baresCollection);
      const baresList = baresSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filtra los bares por ubicación y zona seleccionadas
      const baresFiltrados = baresList.filter((bar) => {
        return (
          (ubicacion ? bar.ubicacion === ubicacion : true) &&
          (zona ? bar.zona === zona : true)
        );
      });

      setBares(baresFiltrados);
    };

    fetchBares();
  }, [ubicacion, zona]); // Vuelve a cargar los bares cuando cambien ubicación o zona

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Bares en Buenos Aires</h1>

      {/* Selectores para Ubicación y Zona */}
      <div className="filtros">
        <label>
          Ubicación:
          <select className="custom-select" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)}>
            <option value="">Todas</option>
            <option value="CABA">CABA</option>
            <option value="AMBA">AMBA</option>
            <option value="GBA">Gran Buenos Aires</option>
          </select>
        </label>

        <label>
          Zona:
          <select value={zona} onChange={(e) => setZona(e.target.value)}>
            <option value="">Todas</option>
            <option value="sur">Sur</option>
            <option value="este">Este</option>
            <option value="oeste">Oeste</option>
            <option value="norte">Norte</option>
          </select>
        </label>
      </div>

      <div className="contenedorBares">
        {bares.map((bar) => (
          <div className="subContenedor" key={bar.id}>
            <div className="ImagenBoliche">
              {bar.imagenURL ? (
                <img src={bar.imagenURL} alt={`Imagen de ${bar.nombre}`} width="200" />
              ) : (
                <p>Imagen no disponible</p>
              )}
            </div>
            <div className="contenedorDeImagen">
              <div className="informacionImagenes">
                <h3>{bar.nombre}</h3>
                <p>{bar.direccion}</p>
              </div>
              <div className="btn-Imagenes">
                <Link to={`/bares/${bar.id}`}>
                  <button>Ver Más</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ZonaEste;
