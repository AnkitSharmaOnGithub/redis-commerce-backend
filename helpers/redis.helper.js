const createClient = require('redis');

const client = createClient.createClient();

client.on('error', (err) => console.log('Redis Client Error', err));

client.on('ready', () => console.log('Connected Successfully'));

client.connect();

module.exports = client;