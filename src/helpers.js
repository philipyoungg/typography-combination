import { forEach, addIndex, compose, toLower, trim, map, split } from 'Ramda';

// Helpers
// ==========================================

// isMobile :: Document -> Bool
export const isMobile = ('ontouchstart' in document.documentElement &&
  navigator.userAgent.match(/Mobi/));

// forEachIndexed :: (a -> *) -> Int -> [a] -> [a]
export const forEachIndexed = addIndex(forEach);

// cleanText :: String -> String
export const cleanText = compose(toLower, trim);

// stringToArray :: String -> [String]
export const stringToArray = compose(map(trim), split(','));


// addSpaceAfterComma :: String -> String
export const addSpaceAfterComma = word => String(word).replace(/,(?=[^\s])/g, ', ');
