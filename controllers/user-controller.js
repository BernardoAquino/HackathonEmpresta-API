const mysql = require('../mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
    try {
        let query = `SELECT * FROM tbl_usuario WHERE cpf = ?`;
        const result = await mysql.execute(query, [req.body.cpf]);
        if (result.length < 1) {
            return res.status(401).send({ message: 'Authentication failed' })
        }

        bcrypt.compare(req.body.senha, result[0].senha, async (err, results) => {
            if (err) {
                return res.status(401).send({ message: 'Authentication failed' });
            }
            if (results) { 
                const token = jwt.sign({
                    Matricula: parseInt(result[0].matricula),
                    Nome: result[0].nome,
                    CPF: result[0].CPF,
                    Email: result[0].email,
                    DataNascimento: result[0].data_nascimento,
                    NomeMae: result[0].nome_mae,
                    Telefone: result[0].telefone,
                }, process.env.JWT_KEY,
                    {
                        expiresIn: "1d"
                    });

                query = `UPDATE tbl_usuario SET expo_push_token = ?, device_id = ? WHERE cpf = ?`;
                await mysql.execute(query, [req.body.expo_push_token, req.body.device_id, req.body.cpf]);

                return res.status(200).send({
                    usuario: {
                        Matricula: parseInt(result[0].matricula),
                        Nome: result[0].nome,
                        CPF: result[0].CPF,
                        Email: result[0].email,
                        DataNascimento: result[0].data_nascimento,
                        NomeMae: result[0].nome_mae,
                        Telefone: result[0].telefone,
                        IdEndereco: parseInt(result[0].id_endereco),
                        ExpoPushToken: req.body.expo_push_token,
                        DeviceID: req.body.device_id,
                    },
                    token: token
                });
            }
            return res.status(401).send({ message: 'Authentication failed' });
        });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.register = async (req, res, next) => {
    try {
        let query = `SELECT * FROM tbl_usuario WHERE cpf = ?`;
        const results = await mysql.execute(query, [req.body.cpf]);
        if (results.length > 0) {
            res.status(409).send({ message: 'CPF is already registered' })
        } else {
            bcrypt.hash(req.body.senha, 10, async (errBcrypt, hash) => {
                if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }

                query = `INSERT INTO tbl_usuario     
                (matricula, senha, nome, CPF, data_nascimento, nome_mae, email, telefone, id_endereco) VALUES 
                (?, ?, ?, ?, ?, ?, ?, ?, ?);`;
                await mysql.execute(query, [
                    req.body.matricula,
                    hash,
                    req.body.nome,
                    req.body.cpf,
                    req.body.data_nascimento,
                    req.body.nome_mae,
                    req.body.email,
                    req.body.telefone,
                    req.body.id_endereco,
                ]);

                const response = {
                    message: 'Usuario criado com sucesso',
                    usuarioCriado: {
                        Matricula: parseInt(req.body.matricula),
                        Nome: req.body.nome,
                        CPF: req.body.cpf,
                        Email: req.body.email,
                        DataNascimento: req.body.data_nascimento,
                        NomeMae: req.body.nome_mae,
                        Telefone: req.body.telefone,
                        IdEndereco: parseInt(req.body.id_endereco),
                    }
                }
                return res.status(201).send(response);
            });
        }
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.logout = async (req, res, next) => {
    try {
        const token = jwt.decode(req.body.token);
        console.log(token.CPF);

        let query = `UPDATE tbl_usuario SET expo_push_token = '', device_id = '' WHERE cpf = ?`;
        await mysql.execute(query, [token.CPF]);

        const response = {
            message: 'Usuario deslogado'
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};