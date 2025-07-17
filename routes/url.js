const express = require('express');
const router = express.Router();
const { shorten, redirect, deleteUrl, success } = require('../controller/url');

router.post('/', shorten);
router.get('/success/:shortId', success);
router.get('/:shortId', redirect);
router.delete('/delete/:id', deleteUrl);

module.exports = router;