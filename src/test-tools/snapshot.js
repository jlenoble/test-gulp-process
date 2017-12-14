import {cacheFiles} from '../helpers';

export const snapshot = glob => options => {
  return cacheFiles({glob, base1: options.dest,
    debug: options && options.debug});
};
