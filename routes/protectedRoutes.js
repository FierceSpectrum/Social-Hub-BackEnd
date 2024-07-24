const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');

// Aplica el middleware a las rutas protegidas
router.get('/protected-data', authenticateToken);

module.exports = router;
