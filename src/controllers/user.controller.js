const { Router } = require('express');
const { Logger } = require('../core/Logger');
const userService = require('../services/user.service');
const Promise = require('bluebird');

const logger = Logger("controller:user");
const router = Router();

router.post('/login', (req, res) => {
	if (req.session.userId)
		res.status(400).send({
			message: 'user allready loggedn in'
		});
	else
		return userService.verifyUser(req.body)
			.then(user => {
				req.session.userId = user.id;
				req.session.cookie.maxAge = 360000;
				res.send(200, {
					user
				})
			})
			.catch(err => {
				logger.error(JSON.stringify(err))
				res.send(500, {
					message: 'error while verifiying user'
				});
			});
});

router.post('/user', (req, res) => {
	return userService.createUser(req.body)
		.then(user => {
			req.session.userId = user.id;
			req.session.cookie.maxAge = 360000;
			//pubsub.publish(USER_CREATED, user);
			res.status(200)
				.send({
					user
				})
		})
		.catch(err => {
			logger.error(JSON.stringify(err))
			res.status(500).send({
				message: 'error while creating user'
			});
		});
});

router.post('/logout', (req, res) => {
	return new Promise((res, rej) => {
		req.session.destroy((err) => {
			if (err)
				rej(err);
			res(true);
		});
	})
	.then(() => {
		res.sendStatus(200);
	})
	.catch(err => {
		logger.error(JSON.stringify(err))
		res.send(500, {
			message: 'error while loging out'
		});
	});
});

router.get('/me', (req, res) => {
	if (req.session.userId) {
		return userService.findUsers({ ids: [req.session.userId] })
			.then(users => users && users.length === 1 ? users[0] : null)
			.then(user => {
				if (!user)
					res.send(500, {
						message: "user is logged in but not found"
					})
				else {
					res.send(200, {
						user
					});
				}
			})
			.catch(err => {
				logger.error(JSON.stringify(err))
				res.status(500).send({
					message: 'error while getting info on current user'
				});
			});
	} else {
		res.status(400).send({
			message: 'user not logged in'
		});
	}
});
module.exports = router;