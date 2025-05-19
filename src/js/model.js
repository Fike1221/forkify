import { async } from 'regenerator-runtime';
import { API_KEY, API_URL } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';
import { RES_PER_PAGE } from './config.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    numOfResults: 0,
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    // Getting JSON data
    const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);
    // const data = await Promise.race([getJSON(`${API_URL}/${id}`), timeout(4)]);

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    // const res = await fetch(`${API_URL}?search=${query}`);
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    if (data.results === 0)
      throw new Error(
        `We couldn't find you search query. Please try another one`
      );

    state.search.query = query;
    state.search.numOfResults = data.results;
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = start + state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings = state.recipe.servings) {
  state.recipe.ingredients.forEach(
    ing =>
      (ing.quantity = (
        (newServings / state.recipe.servings) *
        ing.quantity
      ).toFixed(2))
  );
  state.recipe.servings = newServings;
};

const storeBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookMarks = function (recipe) {
  // Add recipe as bookmark
  state.bookmarks.push(recipe);

  // Mark the current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  // Store the bookmarks in the local storage
  storeBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);

  // un Mark the bookmarked recipe
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  // Store the bookmarks in the local storage
  storeBookmarks();
};

const init = function () {
  const allBookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  if (allBookmarks) state.bookmarks = allBookmarks;
};

init();

const clearBookmarks = function () {
  state.bookmarks = [];
};
// clearBookmarks();

export const uploadRecipe = async function (data) {
  try {
    const ingredients = Object.entries(data)
      .filter(entry => entry[0].includes(`ingredient`) && entry[1] !== '')
      .map(ing => {
        const ingsArr = ing[1].split(',').map(el => el.trim());
        if (ingsArr.length !== 3)
          throw new Error(
            'Wrong Ingredient format! Please use the correct format'
          );

        const [quantity, unit, description] = ingsArr;
        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });

    const recipeData = {
      title: data.title,
      publisher: data.publisher,
      source_url: data.sourceUrl,
      image_url: data.image,
      servings: +data.servings,
      cooking_time: +data.cookingTime,
      ingredients: ingredients,
    };

    const response = await AJAX(`${API_URL}?key=${API_KEY}`, recipeData);
    state.recipe = createRecipeObject(response);

    // Add to bookmarks
    addBookMarks(state.recipe);
  } catch (err) {
    throw err;
  }
};
