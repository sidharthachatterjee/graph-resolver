import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.should();
import chaiAsPromised from 'chai-as-promised';
let expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);

import { ensureArray, chainThenables } from '../lib/utilities';

let countries = {
	India: ['West Bengal', 'Assam'],
	'United States of America': ['Pennsylvania', 'Texas']
};

let states = {
	'West Bengal': ['Siliguri', 'Kolkata'],
	Assam: ['Guwahati', 'Tezpur'],
	Pennsylvania: ['Philadelphia', 'Pittsburgh'],
	Texas: ['Dallas', 'Fort Worth']
};

let getStatesForCountry = (country) => Promise.resolve(countries[country]),
	getCitiesForState = (state) => Promise.resolve(states[state]);

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
		it('works with a single value', function () {
			return chainThenables([getStatesForCountry, getCitiesForState], 'India')
				.should.eventually.deep.equal(['Siliguri', 'Kolkata', 'Guwahati', 'Tezpur']);
		});
		it('works with an array of values', function () {
			return chainThenables([getStatesForCountry, getCitiesForState], ['India', 'United States of America'])
				.should.eventually.deep.equal(['Siliguri', 'Kolkata', 'Guwahati', 'Tezpur', 'Philadelphia', 'Pittsburgh', 'Dallas', 'Fort Worth']);
		});
		it('calls the first function in the chain with the correct data', function (done) {
			let thenable = sinon.spy(),
				data = 'John Doe';
			let resultPromise = chainThenables([thenable], data);
			resultPromise.then(function () {
				expect(thenable).to.have.been.calledWith(data);
				done();
			});
		});
		it('continues gracefully if a thenable resolves with undefined', function (done) {
			let firstThenable = sinon.stub(),
				secondThenable = sinon.stub(),
				data = ['John Doe', 'Jane Doe'];
			firstThenable.onFirstCall().returns(undefined);
			firstThenable.onSecondCall().returns('Birthday Party');
			secondThenable.returns('Cheesecake');
			let resultPromise = chainThenables([firstThenable, secondThenable], data);
			resultPromise.then(function (result) {
				expect(result).to.deep.equal(['Cheesecake']);
				done();
			});
		});
		it('continues gracefully if a thenable resolves with null', function (done) {
			let firstThenable = sinon.stub(),
				secondThenable = sinon.stub(),
				data = ['John Doe', 'Jane Doe'];
			firstThenable.onFirstCall().returns(null);
			firstThenable.onSecondCall().returns('Birthday Party');
			secondThenable.returns('Cheesecake');
			let resultPromise = chainThenables([firstThenable, secondThenable], data);
			resultPromise.then(function (result) {
				expect(result).to.deep.equal(['Cheesecake']);
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
		it('propagates an Error thrown by a thenable', function () {
			let firstThenable = sinon.stub(),
				secondThenable = sinon.stub(),
				data = 'John Doe',
				error = new Error('firstThenable throws an error');
			firstThenable.throws(error);
			return chainThenables([firstThenable, secondThenable], data)
				.should.be.rejectedWith(error);
		});
	});
});
