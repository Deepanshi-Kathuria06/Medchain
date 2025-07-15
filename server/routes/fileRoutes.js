const express = require('express');
const router = express.Router();
const { upload, uploadFileHandler } = require('../controllers/fileController');
const File = require('../models/File');

// POST /api/files/local-upload
router.post('/files/local-upload', upload, uploadFileHandler);

module.exports = router;
