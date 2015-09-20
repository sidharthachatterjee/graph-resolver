import _ from 'lodash';
import { Graph, alg } from 'graphlib';

_.memoize.Cache = WeakMap;
let dijkstra = _.memoize(alg.dijkstra);

export function setupGraph(pairs) {
	let graph = new Graph({ directed: true });
	_.each(pairs, ({ from, to, method }) => graph.setEdge(from, to, method));
	return graph;
}

export function getPath(graph, source, destination, path = []) {
	let map = dijkstra(graph, source);
	if (map[destination].distance) {
		let predecessor = map[destination].predecessor;
		path.push(graph.edge(predecessor, destination));
		return getPath(graph, source, predecessor, path);
	} else {
		return path.reverse();
	}
}

export function validateRelationship({ from, to, method }) {
	let validations = [
		_.isString(from),
		_.isString(to),
		_.isFunction(method)
	];
	return _.every(validations, Boolean);
}
