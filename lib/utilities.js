import _ from 'lodash';
import Promise from 'bluebird';

export function ensureArray(value) {
  if (!_.isUndefined(value)) {
    return [].concat(value);
  }
}

export function chainThenables(thenables, data) {
  return _.reduce(thenables,
    (previous, current) => previous.map(current).then(_.flattenDeep),
    Promise.resolve(ensureArray(data)));
}
