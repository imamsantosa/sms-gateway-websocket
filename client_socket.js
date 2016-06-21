const io = require('socket.io-client')
const client = io(`http://127.0.0.1:1300`)
const mysql = require('mysql');

const db = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'smsd',
  password : '',
  database : 'smsd'
});

client.on('connect', () => {

	console.log(`connected`)
	client.on('message', (messages) => {
		let pesan = connection.escape(messages.data.text);
		let nomor = messages.data.phone;

		db.query('INSERT INTO (DestinationNumber, TextDecoded) VALUES (?, ?)', [nomor, pesan], (err, rows, fields) => {
            if(err){
            	client.emit('message', {error: err})
            } else {
            	client.emit('message', {id:messages.data.id})
				console.log('kirim pesan ke '+messages.data.phone+' dengan isi '+messages.data.text);

            }
        })
	})
});