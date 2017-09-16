const mongoose = require('mongoose');
const Promise = require('bluebird');
const Environment = require('./Environment');
const { Logger } = require('./Logger');

const log = Logger('app:database');
module.exports = class Database {
	static init() {
		log.debug('Connecting to database %s', Environment.getConfig().database.connection.split('@')[1]);
		
		mongoose.Promise = Promise;

		if (!Environment.isTest())
			return mongoose.connect(Environment.getConfig().database.connection, {
				promiseLibrary: Promise,
				useMongoClient: true,
			}).then(() => {
				log.debug("successfully connected to the database");
			});
		else {
			log.debug("testing database setup");
			return Promise.resolve();
		}
	}
}
