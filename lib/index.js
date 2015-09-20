import _ from 'lodash';

import { chainThenables } from './utilities';
import { setupGraph, getPath, validateRelationship } from './graph';

let Resolver = function (relationships) {
	if (!_(relationships).map(validateRelationship).every(Boolean)) {
		throw new Error('Invalid Relationship');
	}
	this.graph = setupGraph(relationships);
};

Resolver.prototype.resolve = function (value, source, destination) {
	let methods = getPath(this.graph, source, destination);
	return chainThenables(methods, value);
};

export default Resolver;
