import React, { createContext, useState, useEffect } from 'react';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    // Sincronizar `favorites` con `localStorage` en cada cambio
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (bar) => {
    setFavorites(prevFavorites => {
      if (!bar.id) {
        console.error('Intento de agregar un bar sin ID');
        return prevFavorites;
      }

      const isDuplicate = prevFavorites.some(favorite => favorite.id === bar.id);
      if (isDuplicate) {
        console.log('Este bar ya está en favoritos');
        return prevFavorites;
      }

      return [...prevFavorites, { ...bar, id: bar.id.toString() }];
    });
  };

  const removeFavorite = (barId) => {
    setFavorites(prevFavorites => prevFavorites.filter(bar => bar.id !== barId));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};