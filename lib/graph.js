let _ = require('lodash'),
  graphlib = require('graphlib'),
  Graph = graphlib.Graph,
  dijkstra = graphlib.alg.dijkstra;

export function setupGraph(relationships) {
  let graph = new Graph({
    directed: true
  });
  _.each(relationships, function (relationship) {
    graph.setEdge(relationship.from, relationship.to, relationship.method);
  });
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
