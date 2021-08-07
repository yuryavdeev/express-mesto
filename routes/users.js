const router = require('express').Router();

const {
  getAllUsers, getMe, getUser, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/me', getMe);
router.get('/:userId', getUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
