const expect = require('expect');
const { isRealString } = require('./validation');

describe('isRealString', () => {

	it('should reject non-string values', () => {
		let theInput = 124124;

		let result = isRealString(theInput);

		expect(result).toBe(false);
	});

	it('should spaces-only string', () => {
		let theInput = '      ';

		let result = isRealString(theInput);

		expect(result).toBe(false);
	});

	it('should allow string with non space characters', () => {
		let theInput = ' yaddayadda ';

		let result = isRealString(theInput);

		expect(result).toBe(true);
	});
});