import _ from 'lodash';
import Promise from 'bluebird';

import { chainThenables } from './utilities';
import { setupGraph, getPath, validateRelationship } from './graph';

let Resolver = function (relationships) {
	if (!_(relationships).map(validateRelationship).every(Boolean)) {
		throw new Error('Invalid Relationship');
	}
	this.graph = setupGraph(relationships);
};

Resolver.prototype.resolve = function (value, source, destination) {
	let methods;
	try {
		methods = getPath(this.graph, source, destination);
	} catch (error) {
		return Promise.reject(new Error('Invalid Arguments'));
	}

	return chainThenables(methods, value);
};

export default Resolver;
