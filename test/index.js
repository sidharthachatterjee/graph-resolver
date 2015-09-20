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
	it('throws an Error if relationship objects do not contain from', function () {
		const erroneousRelationships = [{
			to: 'Item',
			method: getItemsForEvent
		}];
		let wrappedResolver = () => new Resolver(erroneousRelationships);
		wrappedResolver.should.throw(Error, 'Invalid Relationship');
	});
	it('throws an Error if relationship objects do not contain to', function () {
		const erroneousRelationships = [{
			from: 'Event',
			method: getItemsForEvent
		}];
		let wrappedResolver = () => new Resolver(erroneousRelationships);
		wrappedResolver.should.throw(Error, 'Invalid Relationship');
	});
	it('throws an Error if relationship objects do not contain method', function () {
		const erroneousRelationships = [{
			from: 'Event',
			to: 'Item'
		}];
		let wrappedResolver = () => new Resolver(erroneousRelationships);
		wrappedResolver.should.throw(Error, 'Invalid Relationship');
	});
	describe('resolve', function () {
		it('resolves to an array of values', function () {
			let resolver = new Resolver(relationships);
			return resolver.resolve('Sample', 'Brand', 'Item').should.eventually.deep.equal(['Sample']);
		});
		it('resolves to the input wrapped in an array if source and destination are the same', function () {
			let resolver = new Resolver(relationships);
			return resolver.resolve('Sample', 'Brand', 'Brand').should.eventually.deep.equal(['Sample']);
		});
		it('rejects with an Error if source, destination or value are not passed in', function () {
			let resolver = new Resolver(relationships);
			return resolver.resolve('Sample', 'Brand')
				.should.be.rejectedWith(Error, 'Invalid Arguments');
		});
		it('rejects with an Error if the source or destination are invalid nodes', function () {
			let resolver = new Resolver(relationships);
			return resolver.resolve('Sample', 'Tag', 'Item')
				.should.be.rejectedWith(Error, 'Invalid Arguments');
		});
		it('rejects with an Error if no relationship is found', function () {
			let resolver = new Resolver(relationships);
			return resolver.resolve('Sample', 'Item', 'Event')
				.should.be.rejectedWith(Error, 'Invalid Arguments');
		});
	});
});
