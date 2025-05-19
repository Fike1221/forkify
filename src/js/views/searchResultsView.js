import previewView from './previewView.js';

class SearchResultsView extends previewView {
  _parentEl = document.querySelector('.results');
  _errorMessage = `No result found for your query, Please try another one! 😭`;
  _message = '';
}

export default new SearchResultsView();
