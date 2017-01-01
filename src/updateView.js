import { compose, values, path, forEach } from 'Ramda';
import { cleanText } from './helpers.js';

// Update View
// ==========================================

const updateView = {
  activeInputItem: s => {
    const $items = $('.selectize-input > .item');
    const allProps = compose(values, path([s.activeCombinationIndex, s.activeComponent]))(s.combination);
    const iterateActiveClass = forEach(prop => {
      $items.each((i, elem) => {
        const dataValue = $(elem).attr('data-value');
        if (cleanText(prop) === cleanText(dataValue)) {
          $(elem).addClass('active');
        }
      });
    });
    if (s.activeCombinationIndex === null) {
      $items.removeClass('active');
    } else {
      iterateActiveClass(allProps);
    }
  },

  activeComponent: s => {
    const $components = $('#app .typography__item p');
    $components.removeClass('element-on-focus');
    $components.each((index, elem) => {
      if ($(elem).attr('component-name') === s.activeComponent) {
        $(elem).addClass('element-on-focus');
      }
    });
  },
};

export default updateView;
