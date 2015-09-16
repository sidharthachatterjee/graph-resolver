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
import {setupGraph} from '../lib/graph';

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
    it('works with a single value as a seed');
    it('works with an array of values as a seed');
    it('returns a Promise that resolves to a flat array of values (ObjectIds for now)');
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
    it('calls the first function in the chain with the correct seed', function (done) {
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
    it('returns the result as a flattened array', function (done) {
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
  });
  describe('getPath', function () {
    it('pushes the right edge into the path array');
    it('returns when source and predecessor are equal');
    it('returns the path in the correct order');
    it('calls itself recursively if source and predecessor are not equal');
  });
});
