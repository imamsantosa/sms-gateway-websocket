const {INTEGER, BOOLEAN, STRING, TEXT, UUID} = require('sequelize');

module.exports = (db) => {

    const outbox = db.define('outbox', {

        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        senderNumber: {
            type: STRING
        },
        text : {
            type: TEXT
        },
        sended : {
            type: BOOLEAN,
            defaultValue: false
        },
        confirmed : {
            type: BOOLEAN,
            defaultValue: false
        }
    });

    return outbox;
}