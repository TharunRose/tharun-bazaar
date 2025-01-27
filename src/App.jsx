import React from 'react';
import RecipeList from './components/RecipeList';
import Favorites from './components/Favorites';
import SearchBar from './components/SearchBar';
import { Provider } from 'react-redux';
import store from './redux/store';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <Provider store={store} >
        <BrowserRouter>

          <Routes>
            <Route path='' element={<RecipeList />} />
            <Route path='/fav' element={<Favorites />} />
          </Routes>



        </BrowserRouter>
      </Provider>
    </div>
  );
};

export default App;
