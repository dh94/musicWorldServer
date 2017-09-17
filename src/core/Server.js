const express = require('express');
const http = require('http');
const { Logger } = require('./Logger');
const Environment = require('./Environment');
const log = Logger('app:core:server');

module.exports = class Server {

	static init() {
		return express();
	}

	static run(app, port) {
		const server = app.listen(this.__normalizePort(port));
		let io = require('socket.io').listen(server);
		io.on('connection', function(socket){
			socket.on('login',function(user){
				console.log("connect " + user.userName + " with password " +  user.password);
				socket.emit('loggedin', user.userName);
			});
			socket.on('logout', function () {
				console.log("logout");
				socket.emit('loggedout');
			});
			socket.on('register', function (user) {
				console.log("register");
				io.emit('registerd', user);
			});
		});
		server.on('listening', () => this.__onListening(server));
		server.on('error', (error) => this.__onError(server, error));
		log.debug('Server was started on environment %s', Environment.getName());
		return server;
	}

	static __normalizePort(port) {
		const parsedPort = parseInt(port, 10);
		if (isNaN(parsedPort)) { // named pipe
			return port;
		}
		if (parsedPort >= 0) { // port number
			return parsedPort;
		}
		return false;
	}

	static __onListening(server) {
		log.debug(`Listening on ${this.__bind(server.address())}`);
	}

	static __onError(server, error) {
		if (error['syscall'] !== 'listen') {
			throw error;
		}
		const addr = server.address();
		// handle specific listen errors with friendly messages
		switch (error['code']) {
			case 'EACCES':
				log.error(`${this.__bind(addr)} requires elevated privileges`);
				process.exit(1);
				break;
			case 'EADDRINUSE':
				log.error(`${this.__bind(addr)} is already in use`);
				process.exit(1);
				break;
			default:
				throw error;
		}
	}

	static __bind(addr) {
		return typeof addr === 'string'
			? `pipe ${addr}`
			: `port ${addr.port}`;
	}
}