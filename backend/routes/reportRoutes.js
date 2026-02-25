const express = require('express');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const { exportUsersReport, exportComStationsReport, exportSuppliesReport, exportProvidersReport } = require('../controllers/reportController');

const router = express.Router();

router.get('/export/users', protect, adminOnly, exportUsersReport); // Export users report
router.get('/export/providers', protect, adminOnly, exportProvidersReport); // Export providers report
router.get('/export/com-stations', protect, adminOnly, exportComStationsReport); // Export computer stations report
router.get('/export/supplies', protect, adminOnly, exportSuppliesReport); // Export supplies report

module.exports = router;