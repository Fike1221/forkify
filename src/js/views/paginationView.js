import View from './view';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _currentPage;
  _parentEl = document.querySelector('.pagination');

  _generateMarkup() {
    this._currentPage = this._data.page;
    const totalPages = Math.ceil(
      this._data.numOfResults / this._data.resultsPerPage
    );

    // page 1 and there are other pages
    if (this._currentPage === 1 && totalPages > 1) {
      return `
              ${this._generateTotalPageMarkup(totalPages)}
              ${this._generateMarkupButton('next')}`;
    }
    // last page
    if (this._currentPage === totalPages && totalPages > 1) {
      return `${this._generateMarkupButton('prev')}
              ${this._generateTotalPageMarkup(totalPages, 'end')}`;
    }
    // some other pages
    if (this._currentPage > 1) {
      return `${this._generateMarkupButton('prev')}
              ${this._generateTotalPageMarkup(totalPages, 'middle')}
              ${this._generateMarkupButton('next')}`;
    }

    return '';
  }

  _generateMarkupButton(dir) {
    const goto = dir === 'next' ? this._currentPage + 1 : this._currentPage - 1;
    return `
      <button data-goto="${goto}" class="btn--inline pagination__btn--${dir}">
      ${dir === 'next' ? `<span>Page ${this._currentPage + 1}</span>` : ''}
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-${
      dir === 'next' ? 'right' : 'left'
    }"></use>
        </svg>
        ${dir === 'prev' ? `<span>Page ${this._currentPage - 1}</span>` : ''}
      </button>
      `;
  }
  _generateTotalPageMarkup(pages, status = 'start') {
    const totalPages = status === 'end' ? 'The End' : `Total of ${pages}`;
    return `
    <button class="btn--inline pagination__btn--middle">
        <span>${totalPages}</span>
    </button>`;
  }

  addPageHandler(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn || btn.classList.contains('pagination__btn--middle')) return;
      const gotoPage = +btn.dataset.goto;

      handler(gotoPage);
    });
  }
}

export default new PaginationView();
