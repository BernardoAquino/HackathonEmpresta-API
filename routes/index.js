const { Router } = require('express');

const routes = Router();

routes.use(require('./user'));
routes.use(require('./endereco'));
routes.use(require('./proposta'));

module.exports = routes;