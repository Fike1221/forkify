import * as model from './model';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import searchResultsView from './views/searchResultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import uploadView from './views/uploadRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

module.hot?.accept();

///////////////////////////////////////
const controllRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // 0, rendering spinner
    recipeView.renderSpinner();

    // 1, update results view to make selected search result and the bookmark
    searchResultsView.update(model.getSearchResultsPage());

    // 2,Update the bookmarks view
    // to be diagnosed
    bookmarksView.render(model.state.bookmarks);

    // 3, Loading recipe from model.js
    await model.loadRecipe(id);

    // 4, rendering recipe from recipeView.js
    recipeView.render(model.state.recipe);
  } catch (err) {
    // rendering the error
    if (err.message === 'Failed to fetch')
      err.message = "You're offline, come back later!";
    recipeView.renderError(err.message);
  }
};

const controllSearchResults = async function () {
  try {
    searchResultsView.renderSpinner();

    // 1, Get Search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2, load search results
    await model.loadSearchResults(query);

    // 3, rendering SearchResults
    searchResultsView.render(model.getSearchResultsPage());

    // 4, render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    if (err.message === 'Failed to fetch')
      err.message = "You're offline, come back later!";
    searchResultsView.renderError(err.message);
  }
};

const controllPagination = function (gotoPage) {
  // rendering new Results
  searchResultsView.render(model.getSearchResultsPage(gotoPage));

  // render new pagination buttons
  paginationView.render(model.state.search);
};

const controllServings = function (noOfServings) {
  // Update the recipe servings
  model.updateServings(noOfServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const controllBookmarks = function () {
  // Update the bookmarks in state
  if (!model.state.recipe.bookmarked) model.addBookMarks(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update the recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controllUploadRecipe = async function (data) {
  try {
    // render the spinner
    uploadView.renderSpinner();

    // Upload the new Recipe data
    await model.uploadRecipe(data);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    uploadView.renderMessage();

    // Render bookmarks
    bookmarksView.render(model.state.bookmarks);

    // Change the URL of the address (id)
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // window.history.back();

    // Close form window
    setTimeout(() => {
      uploadView.toggleUploadForm();
      uploadView.resetModalForm();
    }, MODAL_CLOSE_SEC * 1000);

    // Reset the form window
    uploadView.resetModalForm();

    // console.log(model.state.recipe);
  } catch (err) {
    // console.error(err);
    uploadView.renderError(err.message);
    setTimeout(() => {
      uploadView.resetModalForm();
    }, MODAL_CLOSE_SEC * 1000);
  }
};

const init = function () {
  // Handle Events
  recipeView.addHandlerRender(controllRecipe);

  recipeView.addHandlerServings(controllServings);

  recipeView.addHandlerBookmark(controllBookmarks);

  searchView.addSearchHandler(controllSearchResults);

  paginationView.addPageHandler(controllPagination);

  uploadView.addHandlerUpload(controllUploadRecipe);
};

// initialize the app
init();
//////////////////////////////////////////////
//
