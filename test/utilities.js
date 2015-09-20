import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.should();
import chaiAsPromised from 'chai-as-promised';
let expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);

import { ensureArray, chainThenables } from '../lib/utilities';

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
		it('calls a function with [] if a preceding thenable resolves with undefined or null');
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
		it('propagates an Error thrown by a thenable');
	});
});
