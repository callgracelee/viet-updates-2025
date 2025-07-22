/* eslint-disable react/no-access-state-in-setstate */
import { merge } from 'lodash-es';
import { defaultType } from './defaultType';
import { WriteIn } from './WriteIn';
import { FindPattern } from './FindPattern';
import { WordOrder } from './WordOrder';
import { SelectOne } from './SelectOne';
import { SelectManyTrueOrFalse } from './SelectManyTrueOrFalse';

/* =============================================
=            UI: All Available Types            =
============================================= */

export const types = {
  // 1. select-many, alias: multiple-choice
  'select-many': merge({}, defaultType, {}),
  'multiple-choice': merge({}, defaultType, {}),
  // 2. select-one
  'select-one': merge({}, defaultType, SelectOne),
  // 3. true-or-false, alias: select-many-true-or-false
  'true-or-false': merge({}, defaultType, SelectManyTrueOrFalse),
  'select-many-true-or-false': merge({}, defaultType, SelectManyTrueOrFalse),
  // 4. find-pattern, alias: compound-words
  'find-pattern': merge({}, defaultType, FindPattern),
  'compound-words': merge({}, defaultType, FindPattern),
  // 5. fill-in-the-blank, alias: word-order
  'fill-in-the-blank': merge({}, defaultType, WordOrder),
  'word-order': merge({}, defaultType, WordOrder),
  // 6. write-in
  'write-in': merge({}, defaultType, WriteIn),
  // 7. group-multiple-choice
  'group-multiple-choice': merge({}, defaultType, {}),
  // 8. multi-fill-in-the-blank
  'multi-fill-in-the-blank': merge({}, defaultType, WordOrder),
};

export { defaultType };

/* =====  End of All Available Types  ====== */
