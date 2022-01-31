const { Client } = require('pg');

exports.PG = class {
    constructor(client) {
        console.log('Connected to database');
        /**
         * 
         * @param {Client} client 
         */
        this.clientQuery = async (queryCommand) => {
            return new Promise(async (resolve, reject) => {
                client.query(queryCommand, (err, res) => {
                    resolve(res?.rows);
                })
            })
        }

        this.saveMusic = function() {
            
        }
    }

    
};

/**
* 
* @returns {Client}
*/
exports.connect = async function() {
    const client = new Client({ user: 'oz', password: 'NOT_SHOW', database: 'anderson' });
    await client.connect();

    client.query('set search_path = item, public;');

    return client;
}