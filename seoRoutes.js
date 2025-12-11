const express = require('express');
const router = express.Router();
const controller = require('../controllers/seoController');

router.post('/', controller.createSeo);
router.get('/', controller.getAllSeo);

module.exports = router;
