const { Router } = require('express');
const { Logger } = require('../core/Logger');
const songService = require('../services/song.service');
const Promise = require('bluebird');

const logger = Logger("controller:artist");
const router = Router();

router.post('/song', (req, res) => {
	if (req.session.userId)
		songService.createSong(req.body)
			.then(song => {
				res.send(201, {
					song
				})
			})
			.catch(err => {
				logger.error(JSON.stringify(err))
				res.send(500, {
					message: 'error while creating song'
				});
			});
	else
		res.send(401, {
			message: "unauthorized, please login"
		});
});

router.post('/song/:id', (req, res) => {
	if (req.session.userId)
		songService.updateSong({
			id: req.params.id,
			input: req.body
		})
			.then(song => {
				res.send(200, {
					song
				})
			})
			.catch(err => {
				logger.error(JSON.stringify(err))
				res.send(500, {
					message: 'error while updating song'
				});
			});
	else
		res.send(401, {
			message: "unauthorized, please login"
		});
});

router.post('/song/:id/viewed', (req, res) => {
	if (req.session.userId)
		songService.songViewed({
			id: req.params.id
		})
			.then(song => {
				res.send(200, {
					song
				})
			})
			.catch(err => {
				logger.error(JSON.stringify(err))
				res.send(500, {
					message: 'error while updating song view count'
				});
			});
	else
		res.send(401, {
			message: "unauthorized, please login"
		});
});

router.delete('/song/:id', (req, res) => {
	if (req.session.userId)
		songService.removeSong({
			id: req.params.id
		})
			.then(song => {
				res.send(200, {
					song
				})
			})
			.catch(err => {
				logger.error(JSON.stringify(err))
				res.send(500, {
					message: 'error while deleting song'
				});
			});
	else
		res.send(401, {
			message: "unauthorized, please login"
		});
});

router.get('/topSongs', (req, res) => {
	return songService.topSongs()
		.then(topSongs => {
			res.status(200)
				.send({
					topSongs
				})
		})
		.catch(err => {
			logger.error(JSON.stringify(err))
			res.status(500).send({
				message: 'error while retrieving top songs'
			});
		});
});

router.get('/songs', (req, res) => {
	return songService.allSongs()
		.then(songs => {
			res.status(200)
				.send({
					songs
				})
		})
		.catch(err => {
			logger.error(JSON.stringify(err))
			res.status(500).send({
				message: 'error while retrieving all songs'
			});
		});
});

module.exports = router;