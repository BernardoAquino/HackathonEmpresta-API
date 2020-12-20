const { Router } = require('express');
const router = Router();
const login = require('../middlewares/login');

const PropostaController = require('../controllers/proposta-controller');

router.get('/proposta/:matricula', login.required, PropostaController.getProposta);
router.get('/proposta/', login.required, PropostaController.getPropostas);
router.post('/proposta', login.required, PropostaController.postProposta);

router.patch('/status/:idProposta', login.required, PropostaController.statusProposta);

module.exports = router;