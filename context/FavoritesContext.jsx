import React, { createContext, useState, useEffect } from 'react';

export const FavoritesContext = createContext();

// FavoritesContext.js
export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const addFavorite = (bar) => {
    setFavorites(prevFavorites => {
      // Verificar que el bar tiene un ID
      if (!bar.id) {
        console.error('Intento de agregar un bar sin ID');
        return prevFavorites;
      }

      // Verificar duplicados
      const isDuplicate = prevFavorites.some(favorite => favorite.id === bar.id);
      if (isDuplicate) {
        console.log('Este bar ya está en favoritos');
        return prevFavorites;
      }

      // Agregar el nuevo bar
      const newFavorites = [...prevFavorites, {
        ...bar,
        id: bar.id.toString() // Asegurarse de que el ID sea string
      }];

      // Guardar en localStorage
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      
      return newFavorites;
    });
  };

  const removeFavorite = (barId) => {
    setFavorites(prevFavorites => {
      const updatedFavorites = prevFavorites.filter(bar => bar.id !== barId);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};