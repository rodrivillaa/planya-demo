import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

const BarDetail = () => {
  const { id } = useParams(); // Extrae el id desde la URL
  const [bar, setBar] = useState(null);

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
  }, [id]);

return (
    <div>
    {bar ? (
        <>
        <h1>{bar.nombre}</h1>
        <p>Dirección: {bar.direccion}</p>
        {bar.imagenURL && <img src={bar.imagenURL} alt={`Imagen de ${bar.nombre}`} width="400" />}
        <p>Descripción: {bar.descripcion}</p>
        </>
    ) : (
        <p>Cargando detalles del bar...</p>
    )}
    </div>
);
};

export default BarDetail;