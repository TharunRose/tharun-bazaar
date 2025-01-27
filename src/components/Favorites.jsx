import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFavorite } from '../redux/recipeSlice';
import './Favorites.css';

const Favorites = () => {
  const { favorites } = useSelector((state) => state.recipes);
  const dispatch = useDispatch();

  return (
    <div className="favorites-container">
      <h1 className="favorites-title">Favorites</h1>
      <ul className="favorites-list">
        {favorites.length > 0 ? (
          favorites.map((recipe) => (
            <li className="favorites-item" key={recipe.id}>
              <img
                className="favorites-image"
                src={recipe.image}
                alt={recipe.label}
              />
              <div className="favorites-details">
                <h2>{recipe.name}</h2>
                <p>Preparation Time: {recipe.prepTimeMinutes} mins</p>
                <p>Servings: {recipe.servings}</p>
                <h3>Ingredients:</h3>
                <p>{recipe.ingredients}</p>
                <h3>Instructions:</h3>
                <p>{recipe.instructions}</p>
                <button
                  className="favorites-remove-btn"
                  onClick={() => dispatch(removeFavorite(recipe))}
                >
                  Remove from Favorites
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="no-favorites-message">No favorites added yet!</p>
        )}
      </ul>
    </div>
  );
};

export default Favorites;
