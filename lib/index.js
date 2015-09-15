import {chainThenables} from './utilities';
import {setupGraph, getPath} from './graph';

let Resolver = function (relationships) {
  this.graph = setupGraph(relationships);
};

Resolver.prototype.resolve = function (value, source, destination) {
  let methods = getPath(this.graph, source, destination);
  return chainThenables(methods, value);
};

export default Resolver;
