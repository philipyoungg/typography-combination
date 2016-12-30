((document, window, $, R) => {
  R.forEach(key =>
    (window[key] = R[key]))(R.keys(R)); // eslint-disable-line

  const schema = {
    title: {
      type: 'text',
      properties: {
        fontFamily: ['Lato', 'Playfair Display', 'Fira Sans'],
        fontSize: ['3rem'],
        fontWeight: ['600'],
        fontStyle: ['normal'],
        textAlign: ['left'],
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
        textAlign: ['left'],
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
        textAlign: ['left'],
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
  // const selectizeToObject = data => zipObj(['text', 'value'], [data, data]);
  // const placeholderValues = {
    // fontSize: ['4px', '8px', '16px', '32px', '64px'],
  // };
  // const placeholderData = map(map(selectizeToObject), placeholderValues);

  // {k: [String]} => [{k: v}]

  const isMobile = ('ontouchstart' in document.documentElement && navigator.userAgent.match(/Mobi/));

  const cartesianProduct = unapply(lift(reduce(pipe(xprod, map(flatten))))(head, tail));

  const addSpaceAfterComma = word =>
    String(word).replace(/,(?=[^\s])/g, ', ');

  const cartesianObject = converge(map, [
    compose(zipObj, keys),
    compose(apply(cartesianProduct), values),
  ]);

  const insideCombination = converge(zipObj, [
    compose(keys),
    compose(map(cartesianObject), values, map(prop('properties')), values),
  ]);

  const allCombination = memoize(compose(cartesianObject, insideCombination));

  // ///////////////////////////////////////////////////////////////////////////

  const countTotalPermutation = compose(
    reduce(multiply, 1),
    map(length),
    values, prop('properties')
  );
  const wrapWithProperties = map(compose(zipObj(['properties']), of));
  const convertToSchema = compose(wrapWithProperties, map(map(of)), filter(is(Object)));
  const cleanText = compose(toLower, trim);

  // ///////////////////////////////////////////////////////////////////////////

  const initialCombinations = allCombination(schema);

  let state = {
    app: schema,
    activeComponent: compose(head, keys)(schema),
    component: keys(schema),
    combination: initialCombinations,
    totalPermutation: initialCombinations.length,
    activeCombinationIndex: null,
  };

  // ///////////////////////////////////////////////////////////////////////////

  const renderPermutation = () => {
    $('#app').empty();
    console.log(state.totalPermutation);
    state.combination.forEach((item, index) => {
      $('#app')
        .append($('<div>')
          .addClass('typography')
          .attr('combination-index', index)
          .on('mouseenter touchstart mouseleave', handleActiveCombinationIndex)
          .append($('<div>')
            .addClass('typography-identifier')
            .append($('<p>')
              .addClass('typography-identifier__text')
              .text(`Artboard ${index + 1}`)
            )
            .append($('<p>')
              .addClass('typography-identifier__select')
              .html('iterate this style &rarr;')
              .attr('combination-index', index)
              .css({
                textDecoration: state.totalPermutation === 1 ? 'line-through' : '',
              })
              .on('click', handleCombinationToOne)
            ))
            .append($('<div>')
              .addClass('typography__item')
              .append($('<div>') // faux container
                .append($.map(state.component, key =>
                  $('<p>')
                    .attr('component-name', key)
                    .css(item[key])
                    .addClass(`${state.activeComponent === key ? 'element-on-focus' : ''}`)
                    .text(`${item[key].text}`)
                    .on('click', handleActiveState)
                ))
              )
            )
        );
    });
  };

  // ///////////////////////////////////////////////////////////////////////////

  const renderActiveCombination = () => {
    $('.active-combination').empty();
    $('.active-combination')
      .append(
        $.map(state.component, key => {
          const totalCount = countTotalPermutation(state.app[key]);
          return $('<div>')
            .addClass(`active-combination__item ${state.activeComponent === key ? 'is-active' : ''}`)
            .attr('component-name', key)
            .on('click', handleActiveState)
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
  };

  const renderInput = () => {
    const activeProperties = compose(keys, path(['app', state.activeComponent, 'properties']))(state);
    renderActiveCombination();
    $('#inputs').removeClass('loaded');
    if (state.activeComponent) {
      $('#empty-state').removeClass('loaded');
      setTimeout(() => {
        $('#inputs').empty();
        $('#inputs')
        .append($.map(activeProperties, prop => {
          const spacedText = addSpaceAfterComma(state.app[state.activeComponent].properties[prop]); // fix
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

        updateView.activeInputItem();

        $('input').on('change', handleUserInput);
        $('textarea').on('input', handleUserInput);

        if (isMobile) {
          $('.selectize-input > .item').css({
            transition: 'none',
          });
          $('.selectize-input > .item a').css({
            transition: 'none',
          });
        }

        $('#inputs').addClass('loaded');
      }, 150);
    } else {
      setTimeout(() => {
        $('#empty-state').addClass('loaded');
      }, 150);
    }
  };

  // ///////////////////////////////////////////////////////////////////////////

  const updateView = {
    activeInputItem: () => {
      const $items = $('.selectize-input > .item');
      const allProps = compose(values, path([state.activeCombinationIndex, state.activeComponent]))(state.combination);
      const iterateActiveClass = forEach(prop => {
        $items.each((i, elem) => {
          if (cleanText(prop) === cleanText($(elem).attr('data-value'))) {
            $(elem).addClass('active');
          }
        });
      });

      ifElse(
        isNil,
        always($items.removeClass('active')),
        always(iterateActiveClass(allProps))
      )(state.activeCombinationIndex);
    },
    activeComponentProperties: () => {
      const $components = $('#app .typography__item p');
      $components.removeClass('element-on-focus');
      $components.each((index, elem) => {
        if ($(elem).attr('component-name') === state.activeComponent) {
          $(elem).addClass('element-on-focus');
        }
      });
    },
  };

  // ///////////////////////////////////////////////////////////////////////////

  const renderAll = () => {
    renderInput();
    renderPermutation();
  };

  const handleUserInput = function () {
    const inputVal = $(this).val();
    const prop = $(this).attr('name');
    const value = prop === 'text' ? of(inputVal) : split(',', trim(inputVal));
    state = assocPath(['app', state.activeComponent, 'properties', prop], value)(state);
    state = assoc('combination', allCombination(state.app))(state);
    state = assoc('totalPermutation', length(state.combination))(state);
    renderActiveCombination();
    renderPermutation();
  };

  const handleActiveState = function (e) {
    const selectedComponentName = $(this).attr('component-name');

    if (state.activeComponent !== selectedComponentName) {
      if (e.target.className !== 'typography-identifier__select') { // SUPER HACK.
        state = assoc('activeComponent', selectedComponentName)(state);
      }
      updateView.activeComponentProperties();
      renderInput();
    }
    e.stopPropagation();
  };

  const handleActiveCombinationIndex = function (e) {
    const typographyIndex = $(this).attr('combination-index');
    state = assoc('activeCombinationIndex',
      ifElse(
        propEq('type', 'mouseleave'),
        always(null),
        always(typographyIndex)
      )(e)
    )(state);
    updateView.activeInputItem();
  };

  const handleCombinationToOne = function () {
    const typographyIndex = $(this).attr('combination-index');
    if (state.totalPermutation > 1) {
      state = assoc('totalPermutation', 1)(state);
      state = assoc('activeCombinationIndex', 0)(state);
      $('#app').removeClass('loaded');
      $('#input-container').removeClass('loaded');
      $('#credits').removeClass('loaded');
      setTimeout(() => {
        state = assoc('app', convertToSchema(state.combination[typographyIndex]))(state);
        state = assoc('combination', allCombination(state.app))(state);
        state = assoc('totalPermutation', length(state.combination))(state);
        renderPermutation();
        renderInput();
        $('#app').addClass('loaded');
        $('#input-container').addClass('loaded');
        $('#credits').addClass('loaded');
      }, 400);
    }
  };

  $(document).ready(() => {
    renderAll();
    $('#input-container').on('touchstart', handleActiveCombinationIndex);
    $('#app').on('click', handleActiveState);
    setTimeout(() => {
      $('#app').addClass('loaded');
      $('#input-container').addClass('loaded');
      $('#inputs').addClass('loaded');
      $('#credits').addClass('loaded');
    }, 100);
  });
})(document, window, $, R);
