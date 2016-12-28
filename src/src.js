((document, window, $, R) => {
  const sortAllBy = R.path(['color']);

  const app = {
    fontFamily: ['Lato', 'Avenir', 'Georgia', 'Playfair Display', 'Times New Roman'],
    fontSize: ['3rem'],
    fontWeight: ['bold'],
    color: ['#333', 'mediumblue'],
    lineHeight: ['1.2'],
    marginBottom: ['8px'],
    letterSpacing: ['-0.025em'],
    text: ['Guns, Germs, and Steel'],
    metatitle: {
      fontFamily: ['sans-serif'],
      fontSize: ['1rem'],
      fontWeight: ['regular'],
      color: ['#666'],
      lineHeight: ['1.2'],
      marginBottom: ['1.5rem'],
      letterSpacing: ['0'],
      text: ['by Philip Young'],
    },
    description: {
      fontFamily: ['sans-serif', 'Georgia'],
      fontSize: ['1rem'],
      fontWeight: ['regular'],
      color: ['#333'],
      lineHeight: ['1.5'],
      marginBottom: ['0'],
      letterSpacing: ['0'],
      text: [
        "So the first number of the result is easy, a, b, and c, are all the first elements of each array. The second one isn't as easy for me to understand. Are the arguments the second value of each array (2, 2, undefined) or is it the second value of the first array and the first values of the second and third array?",
      ],
    },
  };

  const propLength = R.compose(R.length, R.keys, R.filter(R.isArrayLike))(app);
  const appLength = R.compose(R.length, R.keys)(app);
  const countTotalPermutation = R.compose(
    R.reduce(R.multiply, 1),
    R.map(R.length),
    R.take(propLength), R.values);

  const combinationOf = argN =>
    R.converge(R.map, [
      R.compose(R.zipObj, R.keys),
      R.compose(R.apply(R.liftN(argN, R.unapply(R.identity))), R.values),
    ]);

  const insideCombination = R.converge(R.zipObj, [
    R.compose(R.keys, R.reject(R.isArrayLike)),
    R.compose(R.map(combinationOf(propLength)), R.values, R.reject(R.isArrayLike)),
  ]);

  const allCombination = R.converge(R.compose(combinationOf(appLength), R.merge), [
    R.identity,
    insideCombination,
  ]);

  // ///////////////////////////////////////////////////////////////////////////

  const state = {
    active: 'app',
    activeComponent: app,
  };

  const data = {
    component: R.compose(R.prepend('app'), R.keys, R.reject(R.isArrayLike))(app),
  };

  // ///////////////////////////////////////////////////////////////////////////

  const renderPermutation = component => {
    $('#app').empty();
    const combinations = allCombination(component);
    $('#total-combinations')
      .text(`${combinations.length} total ${combinations.length > 1 ? 'combinations' : 'combination'}`);
    R.sortBy(sortAllBy)(combinations).forEach((item, index) => {
      const {
        description,
        metatitle,
      } = item;

      $('#app')
        .append($('<p>', {
          class: 'typography-item-identifier',
        })
          .text(`${index + 1}. ${item.fontFamily} - ${item.color} - ${item.fontSize}`)
        )
        .append($('<div>', {
          class: 'typography-item',
        })
          .append($('<h1>')
            .text(`${item.text}`)
            .css(item)
          )
          .append($('<p>')
            .text(`${metatitle.text}`)
            .css(metatitle)
          )
          .append($('<p>')
            .text(`${description.text}`)
            .css(description)
          )
        );
    });
  };

  // ///////////////////////////////////////////////////////////////////////////

  const renderInputs = component => {
    $('#input-container').empty();
    $('#input-container')
      .append($('<div>', {
        class: 'active-combination',
      }));
    R.forEach(key => {
      const activeState = key === 'app' ? app : app[key];
      const totalCount = countTotalPermutation(activeState);
      $('.active-combination')
        .append($('<p>', {
          class: `active-combination__item ${state.active === key ? 'active' : ''}`,
          text: key === 'app' ? 'title' : key,
        }).on('click', () => {
          state.activeComponent = key === 'app' ? app : app[key];
          state.active = key;
          renderPermutation(app);
          renderInputs(state.activeComponent);
        }).append($('<p>', {
          class: 'active-combination__count',
          text: `${totalCount} ${totalCount > 1 ? 'combinations' : 'combination'}`,
        })));
    })(data.component);
    $('#input-container')
      .append($('<div>', {
        id: 'inputs',
      }));
    R.forEach(key => {
      $('#inputs')
        .append($('<div>')
          .css({
            marginBottom: '1rem',
          })
          .append($('<label>', {
            text: key,
          })
            .css({
              display: 'block',
              fontSize: '0.75rem',
            })
          )
          .append($('<input>', {
            value: String(component[key]).replace(/,(?=[^\s])/g, ', '),
            name: key,
          }))
        );
    })(R.take(propLength)(R.keys(component)));

    $('input').each((index, inp) => {
      $(inp).selectize({
        delimiter: $(inp).attr('name') === 'text' ? '>' : ',',
        create: input => ({
          value: input,
          text: input,
        }),
      });
    });

    const updatePermutationOnChange = e => {
      const prop = $(e.target).attr('name');
      const value = prop === 'text' ? [$(e.target).val()] :
        R.split(',', R.trim($(e.target).val()));
      state.activeComponent[prop] = value;
      renderPermutation(app);
      renderInputs(state.activeComponent);
    };

    $('input').on('change', updatePermutationOnChange);
  };

  // ///////////////////////////////////////////////////////////////////////////

  renderInputs(app);
  renderPermutation(app);
})(document, window, $, R);
