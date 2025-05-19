import View from './view.js';
import icons from 'url:../../img/icons.svg';

class SortView extends View {
  _parentEl = document.querySelector('.sort');
  _isSorted = false;

  addSortHandler(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const sortBtn = e.target.closest('.sort__btn');
      if (!sortBtn) return;
      this._isSorted = this._isSorted ? false : true;
      handler();
    });
  }

  /**
   * Sorts the given array
   * @param {[]} data array
   * @returns sorted array
   * @author fikadu gebremedhin
   */
  sortRecipes(data) {
    const sortedData = this._isSorted
      ? data
      : data.sort((a, b) => a.ingredients.length - b.ingredients.length);
    return sortedData;
  }

  _generateMarkup() {
    return `
    <button class="btn--inline sort__btn">Sort
      <!-- <svg class="search__icon">
        <use href="${icons}#icon-arrow-top">Sort</use>
      </svg> -->
    </button>
    `;
  }
}

// This is not used by another files
// Just import to use it
export default new SortView();
