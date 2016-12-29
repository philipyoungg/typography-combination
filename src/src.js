((document, window, $, R) => {
  const box = {
    type: 'box',
    properties: {
      fontFamily: ['inherit'],
      fontSize: ['1rem'],
      fontWeight: ['400'],
      fontStyle: ['normal'],
      textTransform: ['none'],
      color: ['#333'],
      lineHeight: ['1.5'],
      marginBottom: [''],
      letterSpacing: [''],
      text: [''],
    },
  };

  let app = {
    title: {
      type: 'text',
      properties: {
        fontFamily: ['Lato', 'Playfair Display', 'Fira Sans'],
        fontSize: ['3rem'],
        fontWeight: ['600'],
        fontStyle: ['normal'],
        textTransform: ['none', 'uppercase'],
        color: ['#333', 'mediumblue'],
        lineHeight: ['1.2'],
        marginBottom: ['8px'],
        letterSpacing: ['-0.025em'],
        text: ['Guns, Germs, and Steel'],
        // textShadow: ['none'],
        // borderRadius: ['0'],
        // boxShadow: ['none'],
        // padding: ['none'],
        // background: ['none'],
        // backgroundImage: ['none'],
        // backgroundBlendMode: ['none'],
        // display: ['block'],
      },
    },
    metatitle: {
      type: 'text',
      properties: {
        fontFamily: ['sans-serif'],
        fontSize: ['1rem'],
        fontWeight: ['400'],
        fontStyle: ['italic'],
        textTransform: ['none'],
        color: ['#666'],
        lineHeight: ['1.2'],
        marginBottom: ['1.5rem'],
        letterSpacing: ['0'],
        text: ['by Jared Diamond'],
      },
    },
    description: {
      type: 'text',
      properties: {
        fontFamily: ['Roboto', 'Crimson'],
        fontSize: ['1rem'],
        fontWeight: ['400'],
        fontStyle: ['normal'],
        textTransform: ['none'],
        color: ['#333'],
        lineHeight: ['1.5'],
        marginBottom: ['0'],
        letterSpacing: ['0'],
        text: [
          'In the 1930s, the Annales School in France undertook the study of long-term historical structures by using a synthesis of geography, history, and sociology. Scholars examined the impact of geography, climate, and land use. Although geography had been nearly eliminated as an academic discipline in the United States after the 1960s, several geography-based historical theories were published in the 1990s.',
        ],
      },
    },
  };
  // const selectizeToObject = data => R.zipObj(['text', 'value'], [data, data]);
  // const placeholderValues = {
    // fontSize: ['4px', '8px', '16px', '32px', '64px'],
  // };
  // const placeholderData = R.map(R.map(selectizeToObject), placeholderValues);

  // {k: [String]} => [{k: v}]

  const flatten = (arr) => [].concat.apply([], arr);

  const cartesianProduct = (...sets) =>
    sets.reduce((acc, set) =>
      flatten(acc.map(x => set.map(y => [...x, y]))),
      [[]]);

  const addSpaceAfterComma = word =>
    String(word).replace(/,(?=[^\s])/g, ', ');

  const combinationOf = R.converge(R.map, [
    R.compose(R.zipObj, R.keys),
    R.compose(R.apply(cartesianProduct), R.values),
  ]);

  const insideCombination = R.converge(R.zipObj, [
    R.compose(R.keys),
    R.compose(R.map(combinationOf), R.values, R.map(R.prop('properties')), R.values),
  ]);

  const allCombination = R.memoize(R.compose(
    combinationOf,
    R.merge(R.prop('properties')(box)),
    insideCombination)
  );

  // ///////////////////////////////////////////////////////////////////////////

  const countTotalPermutation = R.compose(
    R.reduce(R.multiply, 1),
    R.map(R.length),
    R.values, R.prop('properties')
  );

  const wrapWithProperties = R.map(R.compose(R.zipObj(['properties']), R.of));

  const convertToSchema = R.compose(wrapWithProperties, R.map(R.map(R.of)), R.filter(R.is(Object)));

  // ///////////////////////////////////////////////////////////////////////////

  const state = {
    active: 'title',
    totalPermutation: 1,
    component: R.keys(app),
    combinations: allCombination(app),
  };

  // ///////////////////////////////////////////////////////////////////////////

  const renderPermutation = () => {
    $('#app').empty();
    state.combinations = allCombination(app);
    state.combinations.forEach((item, index) => {
      $('#app')
        .append($('<div>')
          .addClass('typography')
          .on('mouseenter', () => {
            R.forEach(prop => {
              $('.selectize-input > .item').each((i, elem) => {
                if ($(elem).attr('data-value').toLowerCase().trim() === prop.toLowerCase().trim()) {
                  $(elem).addClass('active');
                }
              });
            }
            )(R.values(state.combinations[index][state.active]));
          })
          .on('mouseleave', () => {
            $('.selectize-input > .item').removeClass('active');
          })
          .append($('<div>')
            .addClass('typography-identifier')
            .append($('<p>')
              .addClass('typography-identifier__text')
              .text(`${index + 1}. ${item[state.active].fontFamily} - ${item[state.active].fontSize} - ${item[state.active].color} - ${item[state.active].lineHeight}`)
            )
            .append($('<p>')
              .addClass('typography-identifier__select')
              .html('iterate this style &rarr;')
              .css({
                textDecoration: state.totalPermutation === 1 ? 'line-through' : '',
              })
              .on('click', () => {
                if (state.totalPermutation > 1) {
                  state.totalPermutation = 1;
                  $('#app').removeClass('loaded');
                  $('#input-container').removeClass('loaded');
                  setTimeout(() => {
                    updateAppData(convertToSchema(item));
                    $('#app').addClass('loaded');
                    $('#input-container').addClass('loaded');
                  }, 500);
                }
              })
            ))
            .append($('<div>')
              .addClass('typography__item')
              .append($('<div>')
                .css(item)
                .append($.map(state.component, key =>
                  $('<p>')
                    .css(item[key])
                    .addClass(`${state.active === key ? 'element-on-focus' : ''}`)
                    .text(`${item[key].text}`)
                    .on('click', () => {
                      updateActiveState(`${key}`);
                    })
                ))
              )
            )
        );
    });
  };

  // ///////////////////////////////////////////////////////////////////////////

  const renderActiveCombination = () => {
    $('.active-combination').remove();
    $('#input-container')
      .prepend($('<div>')
        .addClass('active-combination')
        .append(
          $.map(state.component, key => {
            const totalCount = countTotalPermutation(app[key]);
            state.totalPermutation *= totalCount;
            return $('<div>')
              .addClass(`active-combination__item ${state.active === key ? 'is-active' : ''}`)
              .on('click', () => {
                updateActiveState(key);
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
        )
      );
  };

  const renderInputs = () => {
    const activeProperties = R.keys(app[state.active].properties);
    renderActiveCombination();
    $('#inputs').remove();
    $('#input-container')
      .append($('<div>')
        .attr('id', 'inputs')
        .append($.map(activeProperties, prop => {
          const spacedText = addSpaceAfterComma(app[state.active].properties[prop]);
          return $('<div>')
            .css({
              marginBottom: '0.75rem',
            })
            .append($('<label>')
              .text(prop.replace(/([A-Z])/g, ' $1')) // space after capital case
            )
            .append($(`${prop === 'text' ? '<textarea>' : '<input>'}`)
              .text(`${prop === 'text' ? spacedText : ''}`)
              .attr('value', `${prop !== 'text' ? spacedText : ''}`)
              .attr('name', prop)
            );
        }))
      );

    // ///////////////////////////////////////////////////////////////////////////

    $('input').selectize({
      plugins: ['remove_button', 'restore_on_backspace'],
      persist: true,
      create: input => ({
        value: input,
        text: input,
      }),
      delimiter: ',',
    });

    const handleUserInput = e => {
      const prop = $(e.target).attr('name');
      const value = prop === 'text' ?
        [$(e.target).val()] :
        R.split(',', R.trim($(e.target).val()));
      app[state.active].properties[prop] = value;
      renderActiveCombination();
      renderPermutation();
    };

    $('input').on('change', handleUserInput);
    $('textarea').on('input', handleUserInput);
  };

  // ///////////////////////////////////////////////////////////////////////////

  const renderAll = () => {
    renderInputs();
    renderPermutation();
  };

  const updateAppData = newData => {
    app = newData;
    renderAll();
  };

  const updateActiveState = newData => {
    state.active = newData;
    renderAll();
  };

  renderAll();

  $(document).ready(() => {
    $('#app').addClass('loaded');
  });
})(document, window, $, R);
