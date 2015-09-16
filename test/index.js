/*eslint-disable no-console */

import _ from 'lodash';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.should();
let expect = chai.expect;
let assert = chai.assert;
chai.use(sinonChai);

import Resolver from '../lib';
import {Graph} from 'graphlib';
import {ensureArray, chainThenables} from '../lib/utilities';
import {setupGraph, getPath} from '../lib/graph';

const getItemsForEvent = input => input,
  getEventsForBrand = input => input;

const relationships = [{
  from: 'Event',
  to: 'Item',
  method: getItemsForEvent
}, {
  from: 'Brand',
  to: 'Event',
  method: getEventsForBrand
}];

describe('Resolver', function () {
  it('has the resolve function in its prototype', function () {
    expect(Resolver.prototype).to.have.property('resolve');
    expect(Resolver.prototype.resolve).to.be.a('function');
  });
  it('constructs an object with an instance of Graph in its graph property', function () {
    let resolver = new Resolver(relationships);
    expect(resolver).to.have.property('graph');
    expect(resolver.graph).to.be.an.instanceof(Graph);
  });
  describe('resolve', function () {
    it('returns a Promise that resolves to an array of values');
    it('rejects with an Error if not passed a source, destination or seed value');
    it('rejects with an Error source or destination are not strings');
    it('rejects with an Error if source or destination are not nodes in the graph');
  });
});

describe('Utilities', function () {
  describe('ensureArray', function () {
    it('returns an array when passed a single value', function () {
      let result = ensureArray(5);
      expect(result).to.be.an('array');
      expect(result).to.have.length(1);
      expect(result).to.include.members([5]);
    });
    it('returns an array when passed an array', function () {
      let result = ensureArray([5, 10]);
      expect(result).to.be.an('array');
      expect(result).to.have.length(2);
      expect(result).to.include.members([5, 10]);
    });
    it('returns undefined when passed nothing', function () {
      let result = ensureArray();
      expect(result).to.equal(undefined);
    });
  });
  describe('chainThenables', function () {
    it('works with a single value');
    it('works with an array of values');
    it('calls the first function in the chain with the correct data', function (done) {
      let thenable = sinon.spy(),
        data = 'John Doe';
      let resultPromise = chainThenables([thenable], data);
      resultPromise.then(function () {
        expect(thenable).to.have.been.calledWith(data);
        done();
      });
    });
    it('calls the functions in the chain in the correct order', function (done) {
      let firstThenable = sinon.stub(),
        secondThenable = sinon.stub(),
        data = 'John Doe';
      firstThenable.returns(['Birthday Party', 'Funeral']);
      let resultPromise = chainThenables([firstThenable, secondThenable], data);
      resultPromise.then(function () {
        expect(firstThenable).to.have.been.calledWith(data);
        expect(secondThenable.firstCall).to.have.been.calledWith('Birthday Party');
        expect(secondThenable.secondCall).to.have.been.calledWith('Funeral');
        done();
      });
    });
    it('returns the result as a flat array', function (done) {
      let firstThenable = sinon.stub(),
        secondThenable = sinon.stub(),
        data = 'John Doe';
      firstThenable.returns(['Birthday Party', 'Funeral']);
      secondThenable.onFirstCall().returns(['Cookies', 'Cream']);
      secondThenable.onSecondCall().returns(['Wine', 'Bread']);
      let resultPromise = chainThenables([firstThenable, secondThenable], data);
      resultPromise.then(function (result) {
        expect(result).to.be.an('array');
        expect(result).to.have.length(4);
        expect(result).to.include.members(['Cookies', 'Cream', 'Wine', 'Bread']);
        done();
      });
    });
    it('throws an Error if passed undefined or an empty array');
    it('throws an Error if passed array contains anything but functions');
  });
});

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
    it('throws an Error if passed an empty array');
    it('throws an Error if passed undefined');
    it('throws an Error if passed null');
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
    it('returns undefined if no graph is passed', function () {
      let path = getPath(undefined, 'Brand', 'Event', []);
      expect(path).to.equal(undefined);
    });
    it('returns undefined if no source is passed', function () {
      let graph = setupGraph(relationships);
      let path = getPath(graph, undefined, 'Event', []);
      expect(path).to.equal(undefined);
    });
    it('returns undefined if no destination is passed', function () {
      let graph = setupGraph(relationships);
      let path = getPath(graph, 'Brand', undefined, []);
      expect(path).to.equal(undefined);
    });
  });
});
