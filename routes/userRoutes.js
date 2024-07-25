const express = require('express');

const {
  postUser,
  getUsers,
  getUserByID,
  patchUser,
  deleteUser
} = require('../controllers/userController');

const router = express.Router();

router.post('', postUser);
router.get('', getUsers);
router.get('', getUserByID);
router.patch('', patchUser);
router.delete('', deleteUser);

module.exports = router;
