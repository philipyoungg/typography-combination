((document, window, $, R) => {
  const sortAllBy = R.path(['color']);

  const app = {
    fontFamily: ['Lato', 'Avenir', 'Georgia', 'Playfair Display', 'Times New Roman'],
    fontSize: ['3rem'],
    color: ['#333', 'mediumblue'],
    lineHeight: ['1.2'],
    marginTop: ['0'],
    marginBottom: ['8px'],
    letterSpacing: ['-0.025em'],
    text: ['Guns, Germs, and Steel'],
    description: {
      text: ["So the first number of the result is easy, a, b, and c, are all the first elements of each array. The second one isn't as easy for me to understand. Are the arguments the second value of each array (2, 2, undefined) or is it the second value of the first array and the first values of the second and third array?"],
      fontFamily: ['sans-serif', 'Georgia'],
      fontSize: ['1rem'],
      color: ['#333'],
      lineHeight: ['1.5'],
      marginTop: ['0'],
      marginBottom: ['0'],
      letterSpacing: ['0'],
    },
    subTitle: {
      text: ['by Philip Young'],
      fontFamily: ['sans-serif'],
      fontSize: ['1rem'],
      color: ['#666'],
      lineHeight: ['1.2'],
      marginTop: ['0'],
      marginBottom: ['1.5rem'],
      letterSpacing: ['0'],
    },
  };

  const propLength = R.compose(R.length, R.keys, R.filter(R.isArrayLike))(app);
  const appLength = R.compose(R.length, R.keys)(app);

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

  const renderInputs = () => {
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
            value: String(app[key]).replace(/,(?=[^\s])/g, ', '),
            name: key,
          }))
        );
    })(R.take(propLength)(R.keys(app)));
  }

  const renderPermutation = () => {
    const data = allCombination(app);
    $('#total-combinations')
      .text(`${data.length} total combinations`)
    R.sortBy(sortAllBy)(data).forEach((item, index) => {
      const {
        text,
        color,
        fontFamily,
        fontSize,
        lineHeight,
        marginBottom,
        description,
        subTitle,
        letterSpacing,
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
            .text(`${text}`)
            .css({
              fontFamily,
              color,
              fontSize,
              lineHeight,
              marginBottom,
              letterSpacing,
            })
          )
          .append($('<p>')
            .text(`${subTitle.text}`)
            .css({
              fontFamily: subTitle.fontFamily,
              color: subTitle.color,
              fontSize: subTitle.fontSize,
              lineHeight: subTitle.lineHeight,
              marginBottom: subTitle.marginBottom,
            })
          )
          .append($('<p>')
            .text(`${description.text}`)
            .css({
              fontFamily: description.fontFamily,
              color: description.color,
              fontSize: description.fontSize,
              lineHeight: description.lineHeight,
              marginBottom: description.marginBottom,
            })
          ));
    });
  };

  // ///////////////////////////////////////////////////////////////////////////

  renderInputs();
  renderPermutation();

  $('input').each((index, inp) => {
    $(inp).selectize({
      delimiter: $('input').attr('name') === 'text' ? '>' : ',',
      create: input => ({
        value: input,
        text: input,
      }),
    });
  });

  $('input').on('change', e => {
    const prop = $(e.target).prop('name');
    const value = R.split(',', R.trim($(e.target).val()));
    app[prop] = prop === 'text' ? [$(e.target).val()] : value;

    $('#app').empty();
    renderPermutation();
  });
})(document, window, $, R);
