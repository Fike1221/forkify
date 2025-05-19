// import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';

class BookmarksView extends previewView {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage = `No bookmarks yet. Find a nice recipe and bookmark it`;
  _message = '';

  addLoadingHandler(handler) {
    window.addEventListener('load', handler);
  }
}

export default new BookmarksView();
