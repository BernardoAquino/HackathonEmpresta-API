const mysql = require('../mysql');

exports.getEnderecos = async (req, res, next) => {
    try {
        const query = `SELECT * FROM tbl_endereco;`;

        const result = await mysql.execute(query, []);
        const response = {
            quantidade: result.length,
            enderecos: result.map(item => {
                return {
                    IdEndereco: item.id_endereco,
                    CEP: item.CEP,
                    Logradouro: item.Description,
                    Numero: item.numero,
                    Cidade: item.cidade,
                    Estado: item.estado
                }
            })
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.getEndereco = async (req, res, next) => {
    try {
        const query = 'SELECT e.* FROM tbl_usuario u INNER JOIN tbl_endereco e ON u.id_endereco = e.id_endereco WHERE u.matricula = ?;';
        const result = await mysql.execute(query, [req.params.matricula]);
        if (result.length == 0) {
            return res.status(404).send({
                message: 'Endereco não existe'
            })
        }

        const response = {
            endereco: {
                IdEndereco: result[0].id_endereco,
                CEP: result[0].CEP,
                Logradouro: result[0].Description,
                Numero: result[0].numero,
                Cidade: result[0].cidade,
                Estado: result[0].estado
            }
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.postEndereco = async (req, res, next) => {
    try {
        const query = `INSERT INTO tbl_endereco (CEP, logradouro, numero, cidade, estado) VALUES (?, ?, ?, ?, ?);`;
        const results = await mysql.execute(query, [
            req.body.CEP,
            req.body.logradouro,
            req.body.numero,
            req.body.cidade,
            req.body.estado
        ]);

        const response = {
            message: 'Endereco criado com sucesso',
            enderecoCriado: {
                IdEndereco: results.insertId,
                CEP: req.body.cep,
                Logradouro: req.body.logradouro,
                Numero: req.body.numero,
                Cidade: req.body.cidade,
                Estado: req.body.estado,
            }
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.updateEndereco = async (req, res, next) => {
    try {
        const query = `UPDATE tbl_endereco 
                            SET CEP = ?, 
                            logradouro = ?, 
                            numero = ?,
                            cidade = ?,
                            estado = ?
                        WHERE id_endereco = ?;`;
        await mysql.execute(query, [
            req.body.CEP,
            req.body.logradouro,
            req.body.numero,
            req.body.cidade,
            req.body.estado,
            req.params.idEndereco,
        ]);

        const response = {
            message: 'Endereco alterado com sucesso',
            gastoChanged: {
                IdEndereco: req.params.idEndereco,
                CEP: req.body.cep,
                Logradouro: req.body.logradouro,
                Numero: req.body.numero,
                Cidade: req.body.cidade,
                Estado: req.body.estado,
            }
        }
        return res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};