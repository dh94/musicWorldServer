const { Router } = require('express');
const { Logger } = require('../core/Logger');
const artistService = require('../services/artist.service');
const Promise = require('bluebird');

const logger = Logger("controller:artist");
const router = Router();

router.post('/artist', (req, res) => {
	if (req.session.userId)
		artistService.createArtist(req.body)
			.then(artist => {
				res.send(201, {
					artist
				})
			})
			.catch(err => {
				logger.error(JSON.stringify(err))
				res.send(500, {
					message: 'error while creating artist'
				});
			});
	else
		res.send(401, {
			message: "unauthorized, please login"
		});
});

router.post('/artist/:id', (req, res) => {
	if (req.session.userId)
		artistService.updateArtist({
			id: req.params.id,
			input: req.body
		})
			.then(artist => {
				res.send(200, {
					artist
				})
			})
			.catch(err => {
				logger.error(JSON.stringify(err))
				res.send(500, {
					message: 'error while creating artist'
				});
			});
	else
		res.send(401, {
			message: "unauthorized, please login"
		});
});

router.delete('/artist/:id', (req, res) => {
	if (req.session.userId)
		artistService.removeArtist({
			id: req.params.id
		})
			.then(artist => {
				res.send(200, {
					artist
				})
			})
			.catch(err => {
				logger.error(JSON.stringify(err))
				res.send(500, {
					message: 'error while deleting artist'
				});
			});
	else
		res.send(401, {
			message: "unauthorized, please login"
		});
});

router.get('/topArtists', (req, res) => {
	return artistService.topArtists()
		.then(artists => {
			res.status(200)
				.send({
					topArtists: artists.map(artist => ({
						_id: artist._id,
						country: artist.country,
						lastName: artist.lastName,
						firstName: artist.firstName,
						views: artist.views
					}))
				})
		})
		.catch(err => {
			logger.error(JSON.stringify(err))
			res.status(500).send({
				message: 'error while retrieving top artists'
			});
		});
});

router.get('/artists', (req, res) => {
	return artistService.findAll()
		.then(artists => {
			res.status(200)
				.send({
					artists
				})
		})
		.catch(err => {
			logger.error(JSON.stringify(err))
			res.status(500).send({
				message: 'error while retrieving all artists'
			});
		});
});

router.get('/artists/search', (req, res) => {
	return artistService.search(req.query)
		.then(artists => {
			res.status(200)
				.send({
					artists
				})
		})
		.catch(err => {
			logger.error(JSON.stringify(err))
			res.status(500).send({
				message: 'error while retrieving searched artists'
			});
		});
});

module.exports = router;