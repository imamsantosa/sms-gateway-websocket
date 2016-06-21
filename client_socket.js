const io = require('socket.io-client')
// const faker = require('faker')
const client = io(`http://127.0.0.1:1300`)

client.on('connect', () => {

	console.log(`connected`)
	client.on('message', (messages) => {
		console.log('kirim pesan ke '+messages.data.phone+' dengan isi '+messages.data.text);
		client.emit('message', {id:messages.data.id})
	})
	
	// const fakerMessage = () => {
	// 	setTimeout(() => {
	// 		client.emit('message', `${faker.lorem.sentence()}`)
	// 		fakerMessage()
	// 	}, 2000)
	// }

	// fakerMessage()
});