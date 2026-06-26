export { BASE_COPY } from './base.js';
export { LOCALE_ALIASES } from './aliases.js';
import { LOCALE_COPY_GROUP_1 } from './group-1.js';
import { LOCALE_COPY_GROUP_2 } from './group-2.js';
import { LOCALE_COPY_GROUP_3 } from './group-3.js';
import { LOCALE_COPY_GROUP_4 } from './group-4.js';
import { LOCALE_COPY_GROUP_5 } from './group-5.js';
import { LOCALE_COPY_GROUP_6 } from './group-6.js';

export const LOCALE_COPY = {
  ...LOCALE_COPY_GROUP_1,
  ...LOCALE_COPY_GROUP_2,
  ...LOCALE_COPY_GROUP_3,
  ...LOCALE_COPY_GROUP_4,
  ...LOCALE_COPY_GROUP_5,
  ...LOCALE_COPY_GROUP_6
};

export const AVAILABLE_LOCALES = Object.keys(LOCALE_COPY);
