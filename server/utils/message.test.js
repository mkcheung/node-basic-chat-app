const expect = require('expect');

const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {

	it('should generate message object', () => {
		let from = 'user1';
		let text = 'some text';

		let message = generateMessage(from, text);

		expect(message.createdAt).toBeA('number');
		expect(message.from).toBe(from);
		expect(message.text).toBe(text);
	});
});

describe('generateLocationMessage', () => {

	it('should generate a location message object', () => {
		let from = 'user1';
		let lat = 123;
		let long = 234;
		let url = `https://www.google.com/maps?q=123,234`;
		let locationMessage = generateLocationMessage(from, lat, long);

		expect(locationMessage.createdAt).toBeA('number');
		expect(locationMessage).toInclude({from, url});
	});
});