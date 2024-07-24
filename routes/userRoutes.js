const express = require('express');

const {
  userVerificad,
  // userLogin,
  userGet,
  userPost,
  userPatch,
  userDelete,
} = require('../controllers/userController');

const router = express.Router();

router.get('', userGet);
router.post('', userPost);
router.patch('', userPatch);
router.delete('', userDelete);
// router.get('/login', userLogin);

module.exports = router;
