import { useContext, useEffect} from 'react';
import { FavoritesContext } from '../../../../context/FavoritesContext';
import "./favorites.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Favorites = () => {
    const { favorites, removeFavorite } = useContext(FavoritesContext);
  
    useEffect(() => {
      console.log('Estado actual de favoritos:', favorites);
    }, [favorites]);
  
    if (!favorites || favorites.length === 0) {
      return (
        <div>
          <h2>Mis Favoritos</h2>
          <p className='sin_favoritos'>No tienes bares favoritos guardados.</p>
        </div>
      );
    }
  
    return (
      <div>
        <h2>Mis Favoritos ({favorites.length})</h2>
        <div className="favorites-grid">
          {favorites.map((bar, index) => {
            // Crear una key única combinando id e índice
            const uniqueKey = `${bar.id}-${index}`;
            
            return (
              <div key={uniqueKey} className="favorite-card">
                <img 
                  src={bar.imagenURL || '/placeholder-image.jpg'} 
                  alt={bar.nombre || 'Bar'} 
                />
                <h3>{bar.nombre}</h3>
                <p>{bar.ubicacion}</p>
                <button onClick={() => removeFavorite(bar.id)}>
                <FontAwesomeIcon
              icon={faTrash}
                style={{
                  color:  "#931004" ,
                  borderColor:  "yellow" ,
                  borderRadius: "2px"
                }}
              />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  export default Favorites;