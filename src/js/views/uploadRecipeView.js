import icons from 'url:../../img/icons.svg';
import View from './view.js';

class UploadView extends View {
  _parentEl = document.querySelector('.upload');
  _overlayWindow = document.querySelector('.overlay');
  _modalForm = document.querySelector('.add-recipe-window');
  _openModal = document.querySelector('.nav__btn--add-recipe');
  _closeModal = document.querySelector('.btn--close-modal');

  _successMessage = 'Recipe was successfully uploaded';
  _errorMessage = 'Unable to upload your recipe! please try again.';

  constructor() {
    super();
    this._addHandlerOpenModal();
    this._addHandlerCloseModal();
    // this.addHandlerUpload();
  }

  toggleUploadForm() {
    this._overlayWindow.classList.toggle('hidden');
    this._modalForm.classList.toggle('hidden');
    // this._clear();
    // this._parentEl.insertAdjacentElement('afterbegin', this._parentEl);
  }

  _addHandlerOpenModal() {
    this._openModal.addEventListener('click', this.toggleUploadForm.bind(this));
  }
  _addHandlerCloseModal() {
    this._closeModal.addEventListener(
      'click',
      this.toggleUploadForm.bind(this)
    );
    this._overlayWindow.addEventListener(
      'click',
      this.toggleUploadForm.bind(this)
    );
  }

  addHandlerUpload(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();

      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);

      handler(data);
    });
  }

  resetModalForm() {
    window.location.reload();
  }
}

export default new UploadView();
