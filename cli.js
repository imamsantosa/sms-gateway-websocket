const commands  = process.argv.filter((ar, i) => i > 1);
const Sequelize = require('sequelize');
const model     = require('./server_model');

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

const sync = () => {
    console.log("sync....")
    outbox.sync()
}

switch(commands[0]) {
    case "sync":
        sync();
        break;
    default:
        break;
}