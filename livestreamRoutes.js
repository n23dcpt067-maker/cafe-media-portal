const express = require('express');
const router = express.Router();
const controller = require('../controllers/livestreamController');

router.post('/start', controller.startLivestream);
router.post('/:id/stop', controller.stopLivestream);
router.get('/:id/status', controller.getStatus);
router.get('/:id/chat', controller.getChat);
router.post('/:id/chat', controller.postChat);

module.exports = router;
