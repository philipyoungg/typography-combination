import { path, forEach, sortBy } from 'ramda';

const sortAllBy = path(['color']);

const app = {
  text: ['Guns, Germs, and Steel.'],
  fontFamily: ['Lato', 'Avenir', 'Georgia', 'Playfair Display', 'Times New Roman'],
  fontSize: ['3rem'],
  color: ['black', 'mediumblue'],
  lineHeight: ['1.2'],
  marginTop: ['0'],
  marginBottom: ['0.5rem'],
  letterSpacing: ['-0.025em'],
  description: {
    text: ["So the first number of the result is easy, a, b, and c, are all the first elements of each array.The second one isn 't as easy for me to understand. Are the arguments the second value of each array(2, 2, undefined) or is it the second value of the first array and the first values of the second and third array ? "],
    fontFamily: ['sans-serif', 'Georgia'],
    fontSize: ['1rem'],
    color: ['#333'],
    lineHeight: ['1.5'],
    marginTop: ['0'],
    marginBottom: ['1rem'],
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


const data = allCombination(app);

forEach(item => {
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
    );
})(sortBy(sortAllBy)(data));
