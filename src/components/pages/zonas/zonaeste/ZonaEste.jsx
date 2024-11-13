import React, { useEffect, useState } from 'react';
import { db } from '../../../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './zonaeste.css';
import imagen from "../../../../assets/images/imagen.png"

const ZonaEste = () => {
  const [bares, setBares] = useState([]); // Estado para los bares
  const [filteredBares, setFilteredBares] = useState([]); // Estado para los bares filtrados
  const [ubicacion, setUbicacion] = useState(''); // Estado para la ubicación seleccionada
  const [zona, setZona] = useState(''); // Estado para la zona seleccionada
  const [loading, setLoading] = useState(true); // Estado para indicar si está cargando
  const [categoria,setCategoria]=useState("");

  // Carga inicial de bares desde Firebase
  useEffect(() => {
    const fetchBares = async () => {
      const baresCollection = collection(db, 'bares');
      const baresSnapshot = await getDocs(baresCollection);
      const baresList = baresSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTimeout(() => {
        setBares(baresList); // Actualiza el estado con la lista de bares después del timeout
        setFilteredBares(baresList); // Inicializa también los bares filtrados
        setLoading(false); // Finaliza el estado de carga
      }, 2000); // Tiempo de espera en milisegundos (2 segundos)
    };

    fetchBares();
  }, []);

  // Filtrado de bares en función de la ubicación y la zona seleccionada
  useEffect(() => {
    const baresFiltrados = bares.filter((bar) => {
      return (
        (ubicacion ? bar.ubicacion === ubicacion : true) &&
        (categoria ? bar.categoria === categoria : true) &&
        (zona ? bar.zona === zona : true)
      );
    });
    setFilteredBares(baresFiltrados);
  }, [ubicacion,categoria, zona, bares]);

  return (
    <div>
      {loading ? (
        <div className="loading-container">
          {/* Reproduce el video de carga */}
          <video src="/public/cargamotion.mp4" autoPlay loop muted width="100" controls={false} />
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


            <label style={{fontSize:"20px" , fontFamily:"Montserrat", color:"white" }}>
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
                <select
                  className="custom-select"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                >
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
            {filteredBares.map((bar) => (
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
        </>
      )}
    </div>
  );
}

export default ZonaEste;