((document, window, $, R) => {
  const sortAllBy = R.path(['fontFamily']);

  let app = {
    title: {
      type: 'text',
      properties: {
        fontFamily: ['Lato', 'Playfair Display', 'Open Sans'],
        fontSize: ['3rem'],
        fontWeight: [500, 'bold'],
        // fontStyle: ['normal'],
        // textTransform: ['none', 'uppercase'],
        color: ['#333', 'mediumblue'],
        lineHeight: ['1.2'],
        marginBottom: ['8px'],
        letterSpacing: ['-0.025em'],
        text: ['Guns, Germs, and Steel'],
      },
    },
    metatitle: {
      type: 'text',
      properties: {
        fontFamily: ['sans-serif'],
        fontSize: ['1rem'],
        fontWeight: ['regular'],
        // fontStyle: ['italic'],
        // textTransform: ['none'],
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
        fontWeight: ['regular'],
        // fontStyle: ['normal'],
        // textTransform: ['none'],
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

  // const arg = {
  //   10: (a, b, c, d, e, f, g, h, i, j) => [a, b, c, d, e, f, g, h, i, j],
  //   12: (a, b, c, d, e, f, g, h, i, j, k, l) => [a, b, c, d, e, f, g, h, i, j, k, l],
  // };


  const propLength = R.compose(R.length, R.values, R.prop('properties'), R.head, R.values)(app);
  const keyLength = R.compose(R.length, R.keys)(app);
  const appLength = R.sum([propLength, keyLength, -1]);

  const combinationOf = argN =>
    R.converge(R.map, [
      R.compose(R.zipObj, R.keys),
      R.compose(R.apply(R.liftN(argN, R.unapply(R.identity))), R.values),
    ]);

  const insideCombination = R.converge(R.zipObj, [
    R.compose(R.tail, R.keys),
    R.compose(R.map(combinationOf(propLength)), R.values, R.tail, R.map(R.prop('properties')), R.values),
  ]);

  const allCombination = R.converge(R.compose(combinationOf(appLength), R.merge), [
    R.compose(R.prop('properties'), R.head, R.values),
    insideCombination,
  ]);

  // ///////////////////////////////////////////////////////////////////////////

  const countTotalPermutation = R.compose(
    R.reduce(R.multiply, 1),
    R.map(R.length),
    R.values, R.prop('properties'));

  const wrapWithProperties = R.map(R.compose(R.zipObj(['properties']), R.of));

  const convertToSchema = R.converge(R.merge, [
    R.compose(wrapWithProperties, R.zipObj(['title']), R.of, R.map(R.of), R.filter(R.is(String))),
    R.compose(wrapWithProperties, R.map(R.map(R.of)), R.filter(R.is(Object))),
  ]);

  // ///////////////////////////////////////////////////////////////////////////

  const state = {
    active: 'title',
  };

  const data = {
    component: R.keys(app),
  };

  // ///////////////////////////////////////////////////////////////////////////

  const renderPermutation = () => {
    const combinations = allCombination(app);
    $('#app').empty();
    R.sortBy(sortAllBy)(combinations).forEach((item, index) => {
      const {
        description,
        metatitle,
      } = item;

      const localComponent = state.active === 'title' ? item : item[state.active]; // different because it have been rendered

      $('#app')
        .append($('<div>', {
          class: 'typography',
        })
        .append($('<div>', {
          class: 'typography-item-identifier',
        })
        .append($('<p>', {
          class: 'typography-item-identifier__text',
          text: `${index + 1}. ${localComponent.fontFamily} - ${localComponent.fontSize} - ${localComponent.color} - ${localComponent.lineHeight}`,
        }))
        .append($('<p>', {
          class: 'typography-item-identifier__select',
          html: 'iterate this style &rarr;',
        })
          .on('click', () => {
            updateApp(R.merge(app, convertToSchema(item)));
          })
        ))
        .append($('<div>', {
          class: 'typography-item',
        })
          .append($('<h1>', {
            class: state.active === 'title' ? 'element-on-focus' : '',
          })
            .text(`${item.text}`)
            .css(item)
            .on('click', () => {
              updateActiveState('title');
            })
          )
          .append($('<p>', {
            class: state.active === 'metatitle' ? 'element-on-focus' : '',
          })
            .text(`${metatitle.text}`)
            .css(metatitle)
            .on('click', e => {
              updateActiveState('metatitle');
            })
          )
          .append($('<p>', {
            class: state.active === 'description' ? 'element-on-focus' : '',
          })
            .text(`${description.text}`)
            .css(description)
            .on('click', e => {
              state.active = 'description';
              updateActiveState('description');
            })
          )
        )
      );
    });
  };

  // ///////////////////////////////////////////////////////////////////////////

  const renderActiveCombination = () => {
    $('.active-combination').remove();
    $('#input-container')
      .prepend($('<div>', {
        class: 'active-combination',
      }));
    R.forEach(key => {
      const totalCount = countTotalPermutation(app[key]);
      $('.active-combination')
        .append($('<p>', {
          class: `active-combination__item ${state.active === key ? 'active' : ''}`,
          text: key === 'title' ? 'title' : key,
        }).on('click', () => {
          updateActiveState(key);
        }).append($('<p>', {
          class: 'active-combination__count',
          text: `${totalCount} ${totalCount > 1 ? 'combinations' : 'combination'}`,
        })));
    })(data.component);
  };

  const renderInputs = () => {
    renderActiveCombination();
    $('#inputs').remove();
    $('#input-container')
      .append($('<div>', {
        id: 'inputs',
      }));
    R.forEach(prop => {
      if (prop === 'text') {
        $('#inputs')
        .append($('<div>')
          .css({
            marginBottom: '1rem',
          })
          .append($('<label>', {
            text: prop.replace(/([A-Z])/g, ' $1'),
          })
          )
          .append($('<textarea>', {
            text: String(app[state.active].properties[prop]).replace(/,(?=[^\s])/g, ', '),
            name: prop,
          }))
        );
      } else {
        $('#inputs')
        .append($('<div>')
          .css({
            marginBottom: '1rem',
          })
          .append($('<label>', {
            text: prop.replace(/([A-Z])/g, ' $1'),
          })
          )
          .append($('<input>', {
            value: String(app[state.active].properties[prop]).replace(/,(?=[^\s])/g, ', '),
            name: prop,
          }))
        );
      }
    })(R.keys(app[state.active].properties));

    // ///////////////////////////////////////////////////////////////////////////

    $('input').selectize({
      plugins: ['remove_button'],
      persist: false,
      create: input => ({
        value: input,
        text: input,
      }),
    });

    const updatePermutationOnChange = e => {
      const prop = $(e.target).attr('name');
      const value = prop === 'text' ?
        [$(e.target).val()] :
        R.split(',', R.trim($(e.target).val()));
      app[state.active].properties[prop] = value;
      renderPermutation();
      renderActiveCombination();
    };

    $('input').on('change', updatePermutationOnChange);
    $('textarea').on('input', updatePermutationOnChange);
  };

  // ///////////////////////////////////////////////////////////////////////////

  const renderAll = () => {
    renderInputs();
    renderPermutation();
  };

  const updateApp = newData => {
    app = newData;
    renderAll();
  };

  const updateActiveState = newData => {
    state.active = newData;
    renderAll();
  };

  renderAll();
})(document, window, $, R);
