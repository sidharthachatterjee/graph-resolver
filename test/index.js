import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.should();
let expect = chai.expect;
chai.use(chaiAsPromised);

import Resolver from '../lib';
import { Graph } from 'graphlib';

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
	it('throws an Error if relationship objects do not contain from, to or method');
	it('throws an Error if relationship objects have a method that is not a thenable');
	describe('resolve', function () {
		it('returns a Promise that resolves to an array of values', function () {
			let resolver = new Resolver(relationships);
			return resolver.resolve('Sample', 'Brand', 'Item').should.eventually.deep.equal(['Sample']);
		});
		it('returns the input wrapped in an array if source and destination are the same');
		it('throws an Error if the source and destination are invalid nodes');
		it('throws an Error if a relationship is not found even though source and destination are valid nodes');
		it('throws an Error if either source, destination or value are not passed');
	});
});
