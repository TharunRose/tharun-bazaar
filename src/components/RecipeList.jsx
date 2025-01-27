import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipes, addFavorite, filterRecipe, fetchRecipesSearchByMealType } from '../redux/recipeSlice';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import './RecipeList.css';

const RecipeList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { list, status } = useSelector((state) => state.recipes);

    useEffect(() => {
        dispatch(fetchRecipes());
    }, [dispatch]);

    //  Meal type 
    const handleMealTypeChange = (e) => {
        const selectedMealType = e.target.value;
        if (selectedMealType !== "Select") {
            dispatch(fetchRecipesSearchByMealType(selectedMealType));
        }
    };

    if (status === 'loading') return <p className="loading">Loading...</p>;
    if (status === 'failed') return <p className="error">Failed to load recipes.</p>;

    return (
        <div className="recipe-container">
            <SearchBar />

            <div className="meal-type-selector">
                <label htmlFor="meal-type">Meal Type:</label>
                <select id="meal-type" onChange={handleMealTypeChange}>
                    <option value="Select">Select</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Dessert">Dessert</option>
                </select>
            </div>

            <h1 className="recipe-title">Recipes</h1>
            <button className="favorites-btn" onClick={() => navigate('/fav')}>
                View Favorites
            </button>

            <ul className="recipe-list">
                {/*  if list is empty show p tag  */}
                {list && list.length > 0 ? (
                    list.map((recipe) => (
                        <li key={recipe.id} className="recipe-item">
                            <h2>Name: {recipe.name}</h2>
                            <p>Preparation Time: {recipe.prepTimeMinutes} mins</p>
                            <p>Servings: {recipe.servings}</p>
                            <img src={recipe.image} alt={recipe.label} height={100} width={100} />
                            <h3>Ingredients:</h3>
                            <p>{recipe.ingredients}</p>
                            <h3>Instructions:</h3>
                            <p>{recipe.instructions}</p>
                            <button
                                className="add-favorite-btn"
                                onClick={() => dispatch(addFavorite(recipe))}
                            >
                                Add to Favorites
                            </button>
                        </li>
                    ))
                ) : (
                    <p className="no-recipe">Recipe not found</p>
                )}
            </ul>
        </div>
    );
};

export default RecipeList;
