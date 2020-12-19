const { Router } = require('express');
const router = Router();
const login = require('../middlewares/login');

const UserController = require('../controllers/user-controller');

router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.post('/logout', login.required, UserController.logout);

module.exports = router;