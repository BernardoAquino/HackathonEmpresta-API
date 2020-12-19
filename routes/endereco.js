const { Router } = require('express');
const router = Router();
const login = require('../middlewares/login');

const EnderecoController = require('../controllers/endereco-controller');

router.get('/endereco', login.required, EnderecoController.getEnderecos);
router.get('/endereco/:matricula', login.required, EnderecoController.getEndereco);
router.post('/endereco',  login.required, EnderecoController.postEndereco);
router.patch('/endereco/:idEndereco',  login.required, EnderecoController.updateEndereco);

module.exports = router;