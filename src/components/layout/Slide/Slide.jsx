// Importar módulos necesarios
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../../../firebase'; // Asegúrate de importar correctamente tu instancia de Firestore
import { collection, getDocs, query, where } from 'firebase/firestore';
import bannerlogo from "../../../assets/images/pyaa_Mesa_de_trabajo_1.png"

// Importar estilos de Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import "../Slide/Slide.css";

export default () => {
  const [destacados, setDestacados] = useState([]);

  // Función para obtener bares destacados desde Firestore
  useEffect(() => {
    const fetchDestacados = async () => {
      const q = query(collection(db, "bares"), where("destacado", "==", true));
      const querySnapshot = await getDocs(q);
      const baresDestacados = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDestacados(baresDestacados);
    };
    
    

    fetchDestacados();
  }, []);

  return (
    <>
      <div className='banner_img'>
        <img src={bannerlogo} alt="Banner Logo" />
      </div>

      <div className='text-container'>
        <h1>DESTACADOS</h1>
        <h3>Los lugares más visitados</h3>
      </div>

      <div className='btn-1'>
        <Link to={`/zonaeste`}>
          <button>Ver Todo</button>
        </Link>
        <p>Arrastra y Desliza...</p>
      </div>

      <div className='slide'>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={-150}
          slidesPerView={3}
          navigation
          pagination={{ clickable: true }}
          onSwiper={(swiper) => console.log(swiper)}
          onSlideChange={() => console.log('slide change')}>
          {destacados.map((bar) => (
            <SwiperSlide key={bar.id}>
              <img src={bar.imagenURL} alt={bar.nombre} />
              <div className='contenedor'>
                <div className='info'>
                  <h3>{bar.nombre}</h3>
                  <h3>Desde - ${bar.precio}</h3>
                  <h3>{bar.ubicacion}</h3>
                </div>
                <div className='btn'>
                    <Link  to={`/bares/${bar.id}`}>
                  <button>Ver Más</button>
                    
                    </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};