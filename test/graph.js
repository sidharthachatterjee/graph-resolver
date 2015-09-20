import _ from 'lodash';
import chai from 'chai';
chai.should();
let expect = chai.expect;
let assert = chai.assert;

import { setupGraph, getPath } from '../lib/graph';

const getItemsForEvent = input => Promise.resolve([input]),
	getEventsForBrand = input => Promise.resolve([input]);

const relationships = [{
	from: 'Event',
	to: 'Item',
	method: getItemsForEvent
}, {
	from: 'Brand',
	to: 'Event',
	method: getEventsForBrand
}];

describe('Graph', function () {
	describe('setupGraph', function () {
		it('returns a directed graph', function () {
			let graph = setupGraph(relationships);
			assert(graph.isDirected(), 'The graph is undirected');
		});
		it('returns a graph with all nodes in the relationships objects', function () {
			let graph = setupGraph(relationships);
			expect(graph.nodeCount()).to.equal(3);
			expect(graph.nodes()).to.include.members(['Event', 'Item', 'Brand']);
		});
		it('returns a graph with all edges in the relationships objects', function () {
			let graph = setupGraph(relationships);
			expect(graph.edgeCount()).to.equal(2);
			expect(graph.edges().map(_.ary(graph.edge, 1), graph)).to.include.members([getEventsForBrand, getItemsForEvent]);
		});
	});
	describe('getPath', function () {
		it('returns a correctly ordered array of functions for a source and destination', function () {
			let graph = setupGraph(relationships);
			let path = getPath(graph, 'Brand', 'Item', []);
			expect(path).to.have.length(2);
			expect(path).to.include.members([getEventsForBrand, getItemsForEvent]);
			expect(path[0]).to.equal(getEventsForBrand);
			expect(path[1]).to.equal(getItemsForEvent);
		});
		it('returns an empty array when source and destination are equal', function () {
			let graph = setupGraph(relationships);
			let path = getPath(graph, 'Brand', 'Brand', []);
			expect(path).to.be.an('array');
			expect(path).to.have.length(0);
		});
	});
});
