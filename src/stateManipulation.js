import { memoize, compose, reduce, pipe, xprod, map, unnest, zipObj, keys, lift, values, prop, product, length, of, filter, is } from 'Ramda';
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
export const cartesianProduct = reduce(pipe(xprod, map(unnest)), [[]]);

// cartesianObject :: {k: [a]} -> [{k: a}]
export const cartesianObject = lift(map)(compose(zipObj, keys), compose(cartesianProduct, values));

// propsFromSchema :: [{a}] -> [{a}]
export const propsFromSchema = compose(values, map(prop('properties')), values);

// insideCombination :: [{k: v}] -> [{k: v}]
export const insideCombination = lift(zipObj)(keys, compose(map(cartesianObject), propsFromSchema));

// allCombination :: [{k: v}] -> [{k: v}]
export const allCombination = memoize(compose(cartesianObject, insideCombination));

// countTotalPermutation :: [{k: v}] -> Number
export const countTotalPermutation = compose(product, map(length), values, prop('properties'));

// wrapWithProperties :: {a} -> {'properties': {a}}
export const wrapWithProperties = map(compose(zipObj(['properties']), of));

// convertToSchema :: {k: v} -> [{k: v}]
export const convertToSchema = compose(wrapWithProperties, map(map(of)), filter(is(Object)));
