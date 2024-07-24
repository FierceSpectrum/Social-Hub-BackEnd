const express = require('express');

const {
    postPost,
    postGet,
    postPatch,
    postDelete,
} = require('../controllers/postController');

const router = express.Router();

router.get('', postPost);
router.post('', postGet);
router.patch('', postPatch);
router.delete('', postDelete);

module.exports = router;
