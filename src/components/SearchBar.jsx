import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchRecipes, fetchRecipesSearch } from '../redux/recipeSlice';
import './SearchBar.css';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const dispatch = useDispatch();

    // send the query value to get recipe
    const handleSearch = () => {
        dispatch(fetchRecipesSearch(query));
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for recipes..."
                className="search-input"
            />
            <button className="search-btn" onClick={handleSearch}>Search</button>
        </div>
    );
};

export default SearchBar;
