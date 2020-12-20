const mysql = require('../mysql');
const fetch  = require('node-fetch');

exports.getPropostas = async (req, res, next) => {
    try {
        const query = `SELECT p.*, c.* FROM tbl_proposta p LEFT JOIN tbl_cancelamento c ON p.id_cancelamento = c.id_cancelamento ORDER BY data_venda DESC;`;

        const result = await mysql.execute(query, [req.params.matricula]);
        const response = {
            quantidade: result.length,
            propostas: result.map(item => {
                return {
                    IdProposta: item.id_proposta,
                    FaseProposta: item.fase_proposta,
                    Pendecia: item.Pendencia,
                    Situacao: item.situacao,
                    ProtoculoBanco: item.protocolo_banco,
                    Instituicao: item.instituicao,
                    Convenio: item.convenio,
                    Servico: item.servico,
                    ValorLiberado: item.valor_liberado,
                    ValorParcela: item.valor_parcela,
                    QuantidadeParcela: item.quantidade_parcela,
                    DataVenda: item.data_venda,
                    Cancelamento: item.id_cancelamento,
                    ResponsavelCancelamento: item.responsavel,
                    DataCancelamento: item.data,
                    MotivoCancelamento: item.motivo,
                }
            })
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.getProposta = async (req, res, next) => {
    try {
        const query = `SELECT p.*, c.* FROM tbl_proposta p LEFT JOIN tbl_cancelamento c ON p.id_cancelamento = c.id_cancelamento WHERE matricula_usuario = ? ORDER BY p.data_venda DESC;`;

        const result = await mysql.execute(query, [req.params.matricula]);
        const response = {
            quantidade: result.length,
            propostas: result.map(item => {
                return {
                    IdProposta: item.id_proposta,
                    FaseProposta: item.fase_proposta,
                    Pendecia: item.Pendencia,
                    Situacao: item.situacao,
                    ProtoculoBanco: item.protocolo_banco,
                    Instituicao: item.instituicao,
                    Convenio: item.convenio,
                    Servico: item.servico,
                    ValorLiberado: item.valor_liberado,
                    ValorParcela: item.valor_parcela,
                    QuantidadeParcela: item.quantidade_parcela,
                    DataVenda: item.data_venda,
                    Cancelamento: item.id_cancelamento,
                    ResponsavelCancelamento: item.responsavel,
                    DataCancelamento: item.data,
                    MotivoCancelamento: item.motivo,
                }
            })
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.postProposta = async (req, res, next) => {
    try {
        const query = `INSERT INTO tbl_proposta (id_proposta, fase_proposta, pendencia, situacao, protocolo_banco, instituicao, convenio, servico, valor_liberado, valor_parcela, 
            quantidade_parcela, data_venda, matricula_usuario, id_cancelamento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
        const results = await mysql.execute(query, [
            req.body.id_proposta,
            req.body.fase_proposta,
            req.body.pendencia,
            req.body.situacao,
            req.body.protocolo_banco,
            req.body.instituicao,
            req.body.convenio,
            req.body.servico,
            req.body.valor_liberado,
            req.body.valor_parcela,
            req.body.quantidade_parcela,
            req.body.data_venda,
            req.body.matricula_usuario,
            req.body.id_cancelamento
        ]);

        const response = {
            message: 'Proposta criada com sucesso',
            propostaCriada: {
                IdProposta: req.body.id_proposta,
                FaseProposta: req.body.fase_proposta,
                Pendencia: req.body.pendencia,
                Situacao: req.body.situacao,
                ProtocoloBanco: req.body.protocolo_banco,
                Instituicao: req.body.instituicao,
                Convenio: req.body.convenio,
                Servico: req.body.servico,
                ValorLiberado: req.body.valor_liberado,
                ValorParcela: req.body.valor_parcela,
                QuantidadeParcela: req.body.quantidade_parcela,
                DataVenda: req.body.data_venda,
                MatriculaUsuario: req.body.matricula_usuario,
                IdCancelamento: req.body.id_cancelamento,
            }
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.statusProposta = async (req, res, next) => {
    try {
        let query = `UPDATE tbl_proposta SET fase_proposta = ? WHERE id_proposta = ?;`;
        await mysql.execute(query, [
            req.body.fase_proposta,
            req.params.idProposta,
        ]);

        query = 'SELECT u.expo_push_token FROM tbl_proposta p INNER JOIN tbl_usuario u ON p.matricula_usuario = u.matricula WHERE p.id_proposta = ?';
        const result = await mysql.execute(query, [req.params.idProposta]);

        const message = {
            to: result[0].expo_push_token,
            sound: 'default',
            title: 'Alteração no Status da proposta',
            body: 'Sua proposta está com status de: ' + req.body.fase_proposta,
            data: { data: '' },
          }
      
          await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Accept-encoding': 'gzip, deflate',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
          })

        const response = {
            message: 'Status alterado com sucesso',
            gastoChanged: {
                idProposta: req.params.idProposta,
                Status: req.body.fase_proposta,
            }
        }
        return res.status(202).send(response);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error });
    }
};