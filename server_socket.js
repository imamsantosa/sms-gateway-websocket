"use strict"

const http      = require('http')
const io        = require('socket.io')
const Rx        = require('rx')
const Sequelize = require('sequelize')
const model     = require('./server_model')

const server = new http.Server()
const ws     = io(server)

const dbconn = new Sequelize('smsgateway', 'smsgateway', 'smsgateway!', {
	host: '127.0.0.1',
	dialect: 'mysql',
	pool: {
        max: 5,
        min: 0,
        idle: 5000
    }
});

const outbox = model(dbconn);

ws.on('connection', (socketClient) => {
	console.log(`New client`)
	const socketObservable = Rx.Observable.create((observer) => {
		socketClient.on('message', message => observer.onNext(message))
		socketClient.on('error', err => observer.onError(err))
		return () => {
			socketClient.close()
			console.log(`Connection closed`)
		}
	})

	const sendData = () => {
		setTimeout(() => {
			console.log("checking...")
			let getData = outbox.findAll(
				{where: {sended: false}}
			).then((data) => {
				data.forEach(d => {
					let id = d.dataValues.id;
					outbox.update(
						{sended: true},
						{where: {id}}
					)
					let data = {
						id: d.dataValues.id,
						phone: d.dataValues.senderNumber,
						text: d.dataValues.text
					}
					socketClient.emit('message', {data})

					console.log("zz", d.dataValues)
				})
			})
			sendData()
		}, 1000*5)
	}
	sendData();

	const socketSubs = socketObservable
		.subscribe(
			(message) => {
				outbox.update({confirmed: true},{where:{id: message.id}})
			},
			(err) => {
				console.log(err)
				socketSubs.dispose()
			},
			() => {
				console.log(`Done`)
			}
		)

	socketClient.on('disconnected', () => {
		socketSubs && socketSubs.dispose()
	})

})

const port = process.env.PORT || `1300`
server.listen(port, `127.0.0.1`, (err) => {
	if(err) throw err
	console.log(`Server started at port ${port}`)
})