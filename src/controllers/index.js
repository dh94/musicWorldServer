const { Router } = require('express');
const userController = require('./user.controller');
const artistController = require('./artist.controller');
const songController = require('./song.controller');

const router = Router();
router.use(userController);
router.use(artistController);
router.use(songController);

module.exports = router;
