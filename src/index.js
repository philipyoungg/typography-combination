((window, document, $, R) => {
  const schema = {
    headline: {
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
    subheadline: {
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

  // Lift Ramda functions to window
  // ==========================================

  R.forEach(key => (window[key] = R[key]))(R.keys(R));   // eslint-disable-line


  // Helpers
  // ==========================================

  // isMobile :: Document -> Bool
  const isMobile = ('ontouchstart' in document.documentElement &&
    navigator.userAgent.match(/Mobi/));

  // forEachIndexed :: (a -> *) -> Int -> [a] -> [a]
  const forEachIndexed = addIndex(forEach);

  // cleanText :: String -> String
  const cleanText = compose(toLower, trim);

  // stringToArray :: String -> [String]
  const stringToArray = compose(map(trim), split(','));

  // addSpaceAfterComma :: String -> String
  const addSpaceAfterComma = word => String(word).replace(/,(?=[^\s])/g, ', ');


  // Selectize
  // ==========================================

  // const selectizeToObject = data => zipObj(['text', 'value'], [data, data]);
  // const placeholderValues = {
    // fontSize: ['4px', '8px', '16px', '32px', '64px'],
  // };
  // const placeholderData = map(map(selectizeToObject), placeholderValues);


  // State Manipulation
  // ==========================================

  // cartesianProduct :: [a] → [b] → [[a, b]]
  const cartesianProduct = reduce(pipe(xprod, map(unnest)), [[]]);

  // cartesianObject :: {k: [a]} -> [{k: a}]
  const cartesianObject = lift(map)(compose(zipObj, keys), compose(cartesianProduct, values));

  // propsFromSchema :: [{a}] -> [{a}]
  const propsFromSchema = compose(values, map(prop('properties')), values);

  // insideCombination :: [{k: v}] -> [{k: v}]
  const insideCombination = lift(zipObj)(keys, compose(map(cartesianObject), propsFromSchema));

  // allCombination :: [{k: v}] -> [{k: v}]
  const allCombination = memoize(compose(cartesianObject, insideCombination));

  // countTotalPermutation :: [{k: v}] -> Number
  const countTotalPermutation = compose(product, map(length), values, prop('properties'));

  // wrapWithProperties :: {a} -> {'properties': {a}}
  const wrapWithProperties = map(compose(zipObj(['properties']), of));

  // convertToSchema :: {k: v} -> [{k: v}]
  const convertToSchema = compose(wrapWithProperties, map(map(of)), filter(is(Object)));


  // State Initialization
  // ==========================================

  const initialCombinations = allCombination(schema);

  let state = {
    app: schema,
    activeComponent: compose(head, keys)(schema),
    combination: initialCombinations,
    totalPermutation: length(initialCombinations),
    activeCombinationIndex: null,
  };

  // updateState :: {k: v} -> {k: v}
  const updateState = obj => {
    state = merge(state, obj);
  };


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
            .on('mouseenter touchstart mouseleave', h.changeActiveCombinationIndex)
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
                .on('click', h.reduceToOneCombination)
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

  // Event Handlers
  // ==========================================

  const handlers = {
    userInput() {
      const inputVal = $(this).val();
      const prop = $(this).attr('name');
      const value = prop === 'text' ? of(inputVal) : stringToArray(inputVal);
      const stateWithNewProps = assocPath(['app', state.activeComponent, 'properties', prop], value)(state);
      const newCombination = allCombination(stateWithNewProps.app);
      const newState = merge(stateWithNewProps, {
        combination: newCombination,
        totalPermutation: length(newCombination),
      });
      updateState(newState);
      renderView.activeCombination(state, handlers, updateView);
      renderView.combination(state, handlers, updateView);
    },

    changeActiveComponent(e) {
      const selectedComponentName = $(this).attr('component-name');

      if (state.activeComponent !== selectedComponentName) {
        if (e.target.className !== 'typography-identifier__select') {   // SUPER HACK.
          updateState({
            activeComponent: selectedComponentName,
          });
          updateView.activeComponent(state, handlers, updateView);
          renderView.activeCombination(state, handlers, updateView);
          renderView.input(state, handlers, updateView);
        }
      }
      e.stopPropagation();
    },

    changeActiveCombinationIndex(e) {
      const typographyIndex = $(this).attr('combination-index');
      updateState({
        activeCombinationIndex: e.type === 'mouseleave' ? null : typographyIndex,
      });
      updateView.activeInputItem(state);
    },

    reduceToOneCombination() {
      const typographyIndex = $(this).attr('combination-index');
      if (state.totalPermutation > 1) {
        $('#app').removeClass('loaded');
        $('#input-container').removeClass('loaded');
        $('#credits').removeClass('loaded');
        const newApp = convertToSchema(state.combination[typographyIndex]);
        const newCombination = allCombination(newApp);
        updateState({
          totalPermutation: 1,
          activeCombinationIndex: 0,
          app: newApp,
          combination: newCombination,
        });
        setTimeout(() => {
          $('#inputs').removeClass('loaded');
        }, 200);
        setTimeout(() => {
          renderView.combination(state, handlers, updateView);
          renderView.activeCombination(state, handlers, updateView);
          renderView.input(state, handlers, updateView);
          $('#app').addClass('loaded');
          $('#input-container').addClass('loaded');
          $('#credits').addClass('loaded');
        }, 400);
      }
    },
  };

  // Start App
  // ==========================================

  $(document).ready(() => {
    forEach(view => view(state, handlers, updateView), values(renderView));
    $('#input-container').on('touchstart', handlers.changeActiveCombinationIndex);
    $('#app').on('click', handlers.changeActiveComponent);
    $('#app').addClass('loaded');
  });
})(window, document, $, R);
