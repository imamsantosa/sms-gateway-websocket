"use strict";

const express    = require('express');
const bodyParser = require('body-parser');
const validator  = require('express-validator');
const Sequelize  = require('sequelize')
const model      = require('./server_model')

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

// init server
const app = express();

// configuration
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(validator());

app.set('port', process.env.PORT || 1080);

app.post('/v1/send', (req, res) => {
	req.assert('dest', 'destination cant be empty').notEmpty();
    req.assert('message', 'message cant be empty').notEmpty();
    req.assert('token', 'token cant be empty').notEmpty();
    const errors = req.validationErrors();
    if(errors) return res.status(412).json({errors});

    const {dest, message, token} = req.body;
    if(token != "Ao0508") return res.json({error: "your token invalid"})

    outbox.create({
    	senderNumber: dest,
        text : message,
    }).then((outbox) => {
        console.log("success");
        return res.json({error: false, message: "success"})
    }).catch((err) => {
        return res.json({error: true, message: err})
    });

});


app.use((req,res) => {
	res.send("404 Not Found!!")
});

const server = app.listen(app.get('port'), (err) => {
    if(err) throw err;
    console.log(`server is running at ${app.get('port')}`);
});
