((document, window, $, R) => {
  const sortAllBy = R.path(['color']);

  const app = {
    title: {
      text: ['Guns, Germs, and Steel.'],
      fontFamily: ['Lato', 'Avenir', 'Georgia', 'Playfair Display'],
      fontSize: ['3rem'],
      color: ['black', 'mediumblue'],
      lineHeight: ['1.2'],
      marginBottom: ['0.5rem'],
    },
    description: {
      text: ["So the first number of the result is easy, a, b, and c, are all the first elements of each array. The second one isn't as easy for me to understand. Are the arguments the second value of each array (2, 2, undefined) or is it the second value of the first array and the first values of the second and third array?"],
      fontFamily: ['sans-serif', 'Georgia'],
      fontSize: ['1rem'],
      color: ['#333'],
      lineHeight: ['1.5'],
      marginBottom: ['1rem'],
    },
    subTitle: {
      text: ['by Philip Young'],
      fontFamily: ['sans-serif'],
      fontSize: ['1rem'],
      color: ['#666'],
      lineHeight: ['1.2'],
      marginBottom: ['1.5rem'],
    },
  };

  const arg6 = (a, b, c, d, e, f) => [a, b, c, d, e, f];
  const arg8 = (a, b, c, d, e, f, g, h) => [a, b, c, d, e, f, g, h];

  const makeCombination =
    R.converge(R.map, [
      R.compose(R.zipObj, R.keys),
      R.compose(R.apply(R.lift(arg6)), R.values),
    ]);

  const combinationKeys = R.useWith(R.compose(R.apply(R.lift(arg8)), R.concat), [
    R.compose(R.unnest, R.map(R.values)),
    R.values,
  ]);

  const combinationValues = R.useWith(R.compose(R.zipObj, R.concat), [
    R.compose(R.unnest, R.map(R.keys)),
    R.keys,
  ]);

  const combineCombinations = R.converge(R.map, [
    combinationValues,
    combinationKeys,
  ]);

  const combinations = [
    R.zipObj(['subTitle'], [makeCombination(app.subTitle)]),
    R.zipObj(['description'], [makeCombination(app.description)]),
  ];

  const allCombination = combineCombinations(combinations, app.title);

  R.forEach(item => {
    const {
      text,
      color,
      fontFamily,
      fontSize,
      lineHeight,
      marginBottom,
      description,
      subTitle,
    } = item;
    $(document.body)
      .append($('<p>')
        .text(`${item.fontFamily} - ${item.color} - ${item.fontSize}`)
        .css({
          borderBottom: '1px solid silver',
          marginTop: '6rem',
          marginBottom: '1rem',
        })
      )
      .append($('<h1>')
        .text(`${text}`)
        .css({
          fontFamily,
          color,
          fontSize,
          lineHeight,
          marginBottom,
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
      );
  })(R.sortBy(sortAllBy)(allCombination));
})(document, window, $, R);
