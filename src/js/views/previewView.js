import icons from 'url:../../img/icons.svg';
import View from './view.js';

export default class PreviewView extends View {
  _generateMarkup() {
    const id = window.location.hash.slice(1);
    return `
    ${this._data
      .map(item => {
        return `
        <li class="preview">
      <a class="preview__link ${
        item.id === id ? 'preview__link--active' : ''
      }" href="#${item.id}">
        <figure class="preview__fig">
          <img src="${item.image}" alt="Test" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${item.title} ...</h4>
          <p class="preview__publisher">${item.publisher}</p>
          <div class="preview__user-generated  ${item.key ? '' : 'hidden'}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
        </div>

      </a>
    </li>
      `;
      })
      .join('\n')}
    `;
  }
}
