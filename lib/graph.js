import _ from 'lodash';
import {Graph, alg} from 'graphlib';

_.memoize.Cache = WeakMap;
let dijkstra = _.memoize(alg.dijkstra);

export function setupGraph(pairs) {
  let graph = new Graph({
    directed: true
  });
  _.each(pairs, ({from, to, method}) => graph.setEdge(from, to, method));
  return graph;
}

export function getPath(graph, source, destination, path) {
  let map = dijkstra(graph, source);
  let predecessor = map[destination].predecessor;
  if (_.isEqual(predecessor, source)) {
    path.push(graph.edge(predecessor, destination));
    return path.reverse();
  } else {
    path.push(graph.edge(predecessor, destination));
    return getPath(graph, source, predecessor, path);
  }
}
