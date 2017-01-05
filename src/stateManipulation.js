import { memoize, compose, reduce, pipe, xprod, map, unnest, zipObj, keys, lift, values, prop, product, length, of, filter, is } from 'Ramda';

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
export const allCombination = memoize(compose(cartesianObject, insideCombination));

// countTotalPermutation :: [{k: v}] -> Number
export const countTotalPermutation = compose(product, map(length), values, prop('properties'));

// wrapWithProperties :: {a} -> {'properties': {a}}
const wrapWithProperties = map(compose(zipObj(['properties']), of));

// convertToSchema :: {k: v} -> [{k: v}]
export const convertToSchema = compose(wrapWithProperties, map(map(of)), filter(is(Object)));
