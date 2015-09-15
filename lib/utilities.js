import _ from 'lodash';
import Promise from 'bluebird';

export function ensureArray(value) {
  if (_.isUndefined(value)) return value;
  if (_.isArray(value)) {
    return value;
  } else {
    return [value];
  }
}

export function chainThenables(thenables, data) {
  return _.reduce(thenables,
    (previous, current) => previous.map(current).then(_.flattenDeep),
    Promise.resolve(ensureArray(data)));
}
