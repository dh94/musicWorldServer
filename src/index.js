// Core elements to get the server started
const Environment = require('./core/Environment');
const Server = require('./core/Server');
const Database = require('./core/Database');
const { winstonStream, debugStream } = require('./core/Logger');

// Import all express libs
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');

// Import all routes
const routes = require('./controllers/index');

// Initialize the connection to the db
Database.init();

// Create a new express app
const app = Server.init();

// Helmet helps you secure your Express apps by setting various HTTP headers
app.use(helmet());
app.use(helmet.noCache());
app.use(helmet.hsts({
	maxAge: 31536000,
	includeSubdomains: true,
}));

// Enable cors for all routes and origins
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3002'], credentials: true}));
app.use(session({ secret: "shhhh", saveUninitialized: false, rolling: true }));

// add body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Adds winston logger to the express framework
app.use(morgan('dev', debugStream));
app.use(morgan('combined', winstonStream));

// Map routes to the express application
app.use(routes);

// Starts the server and listens for common errors
module.exports = Server.run(app, Environment.getConfig().server.port);
