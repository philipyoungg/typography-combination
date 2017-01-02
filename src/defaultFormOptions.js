import {map} from 'Ramda';

const availableOptions = {
  fontFamily: ['Lato', 'Playfair Display', 'Open Sans', 'Georgia', 'Karla', 'Roboto', 'Cardo', 'Abril Fatface', 'Montserrat', 'Fira Sans', 'Crimson', 'sans-serif', 'serif'],
  fontSize: ['8px', '16px', '32px', '48px'],
  fontWeight: ['100', '400', '700', '900'],
  fontStyle: ['normal', 'italic', 'oblique'],
  textAlign: ['left', 'center', 'right'],
  textTransform: ['none', 'uppercase', 'lowercase', 'capitalize'],
  color: ['black', '#333', '#666', 'coral', 'mediumblue'],
  lineHeight: ['1.2', '1.3', '1.5'],
  marginBottom: ['0', '4px', '8px', '16px', '32px', '48px'],
  letterSpacing: ['-2px', '-1px', '-0.5px', '0', '0.5px', '1px', '2px'],
};

const convertToSelectize = map(map(val => ({
  text: val,
  value: val,
})));

export default convertToSelectize(availableOptions);
