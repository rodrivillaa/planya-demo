import React, { useEffect, useState } from 'react';
import { db } from '../../../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './zonaeste.css';
import imagen from "../../../../assets/images/imagen.png";

const ZonaEste = () => {
  const [bares, setBares] = useState([]);
  const [filteredBares, setFilteredBares] = useState([]);
  const [ubicacion, setUbicacion] = useState('');
  const [zona, setZona] = useState('');
  const [categoria, setCategoria] = useState('');
  const [loading, setLoading] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);

  const baresPorPagina = 20;

  useEffect(() => {
    const fetchBares = async () => {
      const baresCollection = collection(db, 'bares');
      const baresSnapshot = await getDocs(baresCollection);
      const baresList = baresSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTimeout(() => {
        setBares(baresList);
        setFilteredBares(baresList);
        setLoading(false);
      }, 2000);
    };

    fetchBares();
  }, []);

  useEffect(() => {
    const baresFiltrados = bares.filter((bar) => {
      return (
        (ubicacion ? bar.ubicacion === ubicacion : true) &&
        (categoria ? bar.categoria === categoria : true) &&
        (zona ? bar.zona === zona : true)
      );
    });
    setFilteredBares(baresFiltrados);
    setPaginaActual(1); // Reinicia a la primera página después del filtro
  }, [ubicacion, categoria, zona, bares]);

  const indiceInicio = (paginaActual - 1) * baresPorPagina;
  const indiceFin = indiceInicio + baresPorPagina;
  const baresActuales = filteredBares.slice(indiceInicio, indiceFin);

  const totalPaginas = Math.ceil(filteredBares.length / baresPorPagina);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  const paginasVisibles = () => {
    const maxPaginasVisibles = 5;
    const inicio = Math.max(1, paginaActual - Math.floor(maxPaginasVisibles / 2));
    const fin = Math.min(totalPaginas, inicio + maxPaginasVisibles - 1);

    return Array.from({ length: fin - inicio + 1 }, (_, index) => inicio + index);
  };

  const paginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      setPaginaActual(paginaActual + 1);
    }
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  const volverAlInicio = () => {
    setPaginaActual(1); // Vuelve a la página 1
  };

  return (
    <div>
      {loading ? (
        <div className="loading-container">
          <video
            src="/cargamotion.mp4"
            autoPlay
            muted
            playsInline
            controls={false}
            style={{ width: "400px", height: "400px" }}
          />
        </div>
      ) : (
        <>
          <div className='ContenedorPadreBuscaTU'>
            <div className='TitulosBuscaTu'>
              <div className='TitulosBuscaTu_1'>
                <h2>BUSCA TU<span className="puntos onda"><span>.</span><span>.</span><span>.</span></span></h2>
              </div>
            </div>
            <div className="filtros">
              <label style={{ fontSize: "20px", fontFamily: "Montserrat", color: "white" }}>
                Categoria:
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                  <option value="">Todas</option>
                  <option value="bar">Bar</option>
                  <option value="boliche">Boliche</option>
                  <option value="resto">Resto</option>
                  <option value="cine">Cine</option>
                  <option value="plazas">Plazas</option>
                </select>
              </label>
              <label style={{ fontSize: "20px", fontFamily: "Montserrat", color: "white" }}>
                Ubicación:
                <select value={ubicacion} onChange={(e) => setUbicacion(e.target.value)}>
                  <option value="">Todas</option>
                  <option value="CABA">CABA</option>
                  <option value="AMBA">AMBA</option>
                  <option value="GBA">Gran Buenos Aires</option>
                </select>
              </label>
              <label style={{ fontSize: "20px", fontFamily: "Montserrat", color: "white" }}>
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
          </div>

          <div className="contenedorBares">
            {baresActuales.map((bar) => (
              <div className="subContenedor" key={bar.id}>
                <div className="ImagenBoliche">
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

          <div className="paginacion">
            <button
              onClick={paginaAnterior}
              disabled={paginaActual === 1}
              className="flecha"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            {paginasVisibles().map((numero) => (
              <button
                key={numero}
                onClick={() => cambiarPagina(numero)}
                style={{
                  backgroundColor: paginaActual === numero ? '#F28C1D' : 'transparent',
                  color: paginaActual === numero ? 'white' : 'black',
                  margin: '0 5px',
                  padding: '5px 10px',
                  borderRadius: '50px',
                  cursor: 'pointer',
                }}
              >
                {numero}
              </button>
            ))}
            <button
              onClick={paginaSiguiente}
              disabled={paginaActual === totalPaginas}
              className="flecha"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          {/* Botón "Volver al inicio" */}
          {paginaActual > 1 && (
            <div className="volver-inicio">
              <button onClick={volverAlInicio} className="boton-volver-inicio">
                Volver al inicio
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ZonaEste;
