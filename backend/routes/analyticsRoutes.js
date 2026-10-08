const express = require('express');
const router = express.Router();
const { getadminStats } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get("/", protect, admin, getadminStats);
module.exports = router;