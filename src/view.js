import { compose, keys, values, head, path, forEach } from 'Ramda';
import { forEachIndexed, addSpaceAfterComma, isMobile, cleanText } from './helpers';
import { countTotalPermutation } from './stateManipulation';

// Render View
// ==========================================

const view = {
  render: {
    combination: (store, handlers) => {
      const { state } = store;
      $('#app').empty();
      forEachIndexed((item, index) => {
        $('#app')
        .append($('<div>')
          .addClass('typography')
          .attr('combination-index', index)
          .on('mouseenter touchstart mouseleave', function(e) { // eslint-disable-line
            handlers.changeActiveCombinationIndex.apply(this, [store, view, e]);
          })
          .append($('<div>')
            .addClass('typography-identifier')
            .append($('<p>')
              .addClass('typography-identifier__text')
              .text(`Combination ${index + 1}`)
            )
            .append($('<p>')
              .addClass('typography-identifier__select')
              .html('iterate this style &rarr;')
              .attr('combination-index', index)
              .css({
                textDecoration: state.totalPermutation === 1 ? 'line-through' : '',
              })
              .on('click', function(e) { // eslint-disable-line
                handlers.reduceToOneCombination.apply(this, [store, view, e]);
              })
            ))
            .append($('<div>')
              .addClass('typography__item')
              .append($('<div>')
                .append($.map(keys(item), key =>
                  $('<p>')
                    .attr('component-name', key)
                    .css(item[key])
                    .addClass(`${state.activeComponent === key ? 'element-on-focus' : ''}`)
                    .text(`${item[key].text}`)
                    .on('click', function(e) { // eslint-disable-line
                      handlers.changeActiveComponent.apply(this, [store, view, e]);
                    })
                ))
              )
            )
          );
      })(state.combination);
    },

    activeCombination: (store, handlers) => {
      const s = store.state;
      $('.active-combination').addClass('loaded');
      const availableComponent = compose(keys, head)(s.combination);
      $('.active-combination').empty();
      $('.active-combination')
      .append(
        $.map(availableComponent, key => {
          const totalCount = countTotalPermutation(s.app[key]);
          return $('<div>')
            .addClass(`active-combination__item ${s.activeComponent === key ? 'is-active' : ''}`)
            .attr('component-name', key)
            .on('click', function(e) { // eslint-disable-line
              handlers.changeActiveComponent.apply(this, [store, view, e]);
            })
            .append($('<p>')
              .addClass('active-combination__identifier')
              .text(key)
            )
            .append($('<p>')
              .addClass('active-combination__count')
              .text(`${totalCount} ${totalCount > 1 ? 'combinations' : 'combination'}`)
            );
        })
      );
    },

    input: (store, handlers) => {
      const s = store.state;
      const timeoutTime = 150;
      const activeProperties = compose(keys, path([s.activeComponent, 'properties']))(s.app);
      $('#inputs').removeClass('loaded');
      if (!s.activeComponent) {
        setTimeout(() => {
          $('#empty-state').addClass('loaded');
        }, timeoutTime);
      } else {
        $('#empty-state').removeClass('loaded');
        setTimeout(() => {
          $('#inputs').empty();
          $('#inputs')
      .append($.map(activeProperties, prop => {
        const propertyText = path([s.activeComponent, 'properties', prop])(s.app);
        const spacedText = addSpaceAfterComma(propertyText);
        return $('<div>')
          .addClass('input-and-label')
          .append($('<label>')
            .text(prop.replace(/([A-Z])/g, ' $1'))  // space after capital case
          )
          .append($(`${prop === 'text' ? '<textarea>' : '<input>'}`)
            .text(`${prop === 'text' ? spacedText : ''}`)
            .attr('value', `${prop !== 'text' ? spacedText : ''}`)
            .attr('name', prop)
          );
      }));

          $('input').selectize({
            plugins: ['remove_button', 'restore_on_backspace'],
            persist: true,
            create: input => ({
              value: input,
              text: input,
            }),
            delimiter: ',',
          });

          view.update.activeInputItem(store);

          $('input').on('change', function(e) { // eslint-disable-line
            handlers.userInput.apply(this, [store, view]);
          });
          $('textarea').on('input', function(e) { // eslint-disable-line
            handlers.userInput.apply(this, [store, view]);
          });

          if (isMobile) {
            $('.selectize-input > .item').css({
              transition: 'none',
            });
            $('.selectize-input > .item a').css({
              transition: 'none',
            });
          }

          $('#inputs').addClass('loaded');
        }, timeoutTime);
      }
    },
  },
  update: {
    activeInputItem: (store) => {
      const s = store.state;
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

    activeComponent: (store) => {
      const s = store.state;
      const $components = $('#app .typography__item p');
      $components.removeClass('element-on-focus');
      $components.each((index, elem) => {
        if ($(elem).attr('component-name') === s.activeComponent) {
          $(elem).addClass('element-on-focus');
        }
      });
    },
  },
};

export default view;