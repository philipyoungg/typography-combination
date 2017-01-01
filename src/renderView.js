import { forEachIndexed, addSpaceAfterComma, isMobile } from './helpers';
import { countTotalPermutation } from './stateManipulation';

// Render View
// ==========================================

const renderView = {
  combination: (s, h) => {
    $('#app').empty();
    forEachIndexed((item, index) => {
      $('#app')
    .append($('<div>')
      .addClass('typography')
      .attr('combination-index', index)
      .on('mouseenter touchstart mouseleave', h.activeCombinationIndex)
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
            textDecoration: s.totalPermutation === 1 ? 'line-through' : '',
          })
          .on('click', h.combinationToOne)
        ))
        .append($('<div>')
          .addClass('typography__item')
          .append($('<div>')
            .append($.map(keys(item), key =>
              $('<p>')
                .attr('component-name', key)
                .css(item[key])
                .addClass(`${s.activeComponent === key ? 'element-on-focus' : ''}`)
                .text(`${item[key].text}`)
                .on('click', h.changeActiveComponent)
            ))
          )
        )
    );
    })(s.combination);
  },

  activeCombination: (s, h) => {
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
        .on('click', h.changeActiveComponent)
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

  input: (s, h, u) => {
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
              .text(prop.replace(/([A-Z])/g, ' $1')) // space after capital case
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

        u.activeInputItem(s, h);

        $('input').on('change', h.userInput);
        $('textarea').on('input', h.userInput);

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
};

export default renderView;
