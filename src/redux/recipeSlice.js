import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Using
// Fetch recipes from the API
export const fetchRecipes = createAsyncThunk(
  "recipes/fetchRecipes",
  async () => {
    const response = await axios.get("https://dummyjson.com/recipes");
    console.log(response.data.recipes);
    return response.data.recipes;
  }
);

//  using
// Fetch recipes search query from the API
export const fetchRecipesSearch = createAsyncThunk(
  "recipes/fetchRecipesSearch",
  async (query) => {
    const response = await axios.get(
      query == " "
        ? "https://dummyjson.com/recipes"
        : `https://dummyjson.com/recipes/search?q=${query}`
    );
    console.log(response.data);
    return response.data.recipes;
  }
);

// using
// Fetch recipes search query meal type from the API

export const fetchRecipesSearchByMealType = createAsyncThunk(
  "recipes/fetchRecipesSearchByMealType",
  async (query) => {
    const response = await axios.get(
      `https://dummyjson.com/recipes/meal-type/${query}`
    );
    console.log(response.data.recipes);
    return response.data.recipes;
  }
);

const recipeSlice = createSlice({
  name: "recipes",
  initialState: {
    list: [],
    favorites: [],
    status: "idle",
    error: null,
  },
  reducers: {
    // add
    addFavorite: (state, action) => {
      state.favorites.push(action.payload);
    },
    // remove
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(
        (recipe) => recipe.id !== action.payload.id
      );
    },

    //  filter but i can't use that. it's working fine with 80% 

    filterRecipe: (state, action) => {
      console.log(action.payload);
      state.list = state.list.filter((recipe, index) =>
        recipe.name.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchRecipesSearch.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchRecipesSearchByMealType.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      });
  },
});

export const { addFavorite, removeFavorite, filterRecipe } =
  recipeSlice.actions;



export default recipeSlice.reducer;
