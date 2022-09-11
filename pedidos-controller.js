const mysql = require('../mysql').pool

exports.getPedidos = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error, error })
    }
    conn.query(
      `SELECT pedidos.id_pedidos,                      
                       produtos.id_produto,
                       produtos.descricao,
                       produtos.un,
                       pedidos.quantidade,
                       produtos.preco
                  FROM pedidos
            INNER JOIN produtos
                    ON produtos.id_produto = pedidos.id_produto;`,
      (error, resultado, field) => {
        if (error) {
          return res.status(500).send({ error, error })
        }
        const response = {
          produtos: resultado.map(pedido => {
            return {
              id_pedidos: pedido.id_pedidos,
              quantidade: pedido.quantidade,
              produto: {
                id_produto: pedido.id_produto,
                descricao: pedido.descricao,
                un: pedido.un,
                preco: pedido.preco
              },
              request: {
                tipo: 'GET',
                descricao:
                  'Retorna todos os pedidos e seus detalhes especificos',
                url: 'http://localhost:3000/pedidos/' + pedido.id_pedidos
              }
            }
          })
        }
        return res.status(200).send({ response })
      }
    )
  })
}

exports.getPedidosId = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error, error })
    }
    conn.query(
      'SELECT * FROM pedidos WHERE id_pedidos = ?;',
      [req.params.id_pedidos],
      (error, resultado, field) => {
        if (error) {
          return res.status(500).send({ error, error })
        }

        if (resultado.length == 0) {
          return res.status(404).send({
            mensagem: 'Não foi encontrado pedidos com esse ID'
          })
        }
        const response = {
          pedido: {
            id_pedidos: resultado[0].id_pedidos,
            id_produto: resultado[0].id_produto,
            descricao: resultado[0].descricao,
            un: resultado[0].un,
            preco: resultado[0].preco,
            quantidade: resultado[0].quantidade,
            request: {
              tipo: 'GET',
              descricao: 'Retorna um pedidos e seus detalhes',
              url: 'http://localhost:3000/pedidos'
            }
          }
        }
        return res.status(201).send(response)
      }
    )
  })
}

exports.postPedidos = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error })
    }

    conn.query(
      'SELECT * FROM produtos WHERE id_produto = ?',
      [req.body.id_produto],

      (error, resultado, field) => {
        if (error) {
          return res.status(500).send({ error: error })
        }
        if (resultado.length == 0) {
          return res.status(404).send({ mensagem: 'Produto não encontrado' })
        }

        conn.query(
          'INSERT INTO pedidos (id_produto, descricao, un, preco, quantidade) VALUES (?,?,?,?,?)',
          [
            req.body.id_produto,
            req.body.descricao,
            req.body.un,
            req.body.preco,
            req.body.quantidade
          ],
          (error, resultado, field) => {
            conn.release()
            if (error) {
              return res.status(500).send({ error, error })
            }
            const response = {
              mensagem: 'Pedido salvo com sucesso',
              pedido: {
                id_pedidos: resultado.id_pedidos,
                id_produto: req.body.id_produto,
                descricao: req.body.descricao,
                un: req.body.un,
                preco: req.body.preco,
                quantidade: req.body.quantidade,

                request: {
                  tipo: 'POST',
                  descricao: 'Insere um pedido',
                  url: 'http://localhost:3000/pedidos'
                }
              }
            }
            return res.status(201).send(response)
          }
        )
      }
    )
  })
}

exports.patchPedidos = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error, error })
    }
    conn.query(
      `UPDATE pedidos
          SET id_produto    =?,
              descricao     =?,
              un            =?,
              preco         =?,
              quantidade    =?
        WHERE id_pedidos    =?`,
      [
        req.body.id_produto,
        req.body.descricao,
        req.body.un,
        req.body.preco,
        req.body.quantidade,
        req.body.id_pedidos
      ],
      (error, resultado, field) => {
        conn.release()
        if (error) {
          return res.status(500).send({ error, error })
        }
        if (resultado.length == 0) {
          return res.status(404).send({
            mensagem: 'ID não encontrado'
          })
        }
        const response = {
          mensagem: 'pedido atualizado com sucesso',
          pedido: {
            id_pedidos: req.body.id_pedidos,
            id_produto: req.body.id_produto,
            descricao: req.body.descricao,
            un: req.body.un,
            preco: req.body.preco,
            quantidade: req.body.quantidade,
            request: {
              tipo: 'PATCH',
              descricao: 'Altera um pedido',
              url: 'http://localhost:3000/pedidos' + req.body.id_produto
            }
          }
        }
        return res.status(202).send(response)
      }
    )
  })
}

exports.deletePedidos = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error, error })
    }
    conn.query(
      'DELETE FROM pedidos WHERE id_pedidos = ?',
      [req.body.id_pedidos],
      (error, resultado, field) => {
        conn.release()
        if (error) {
          return res.status(500).send({ error, error })
        }
        const response = {
          mensagem: 'Pedido deletado com sucesso',
          produto: {
            request: {
              tipo: 'DELETE',
              descricao: 'Deleta um pedido',
              url: 'http://localhost:3000/pedidos',
              body: {
                id_produto: 'Number',
                descricao: 'String',
                un: 'String',
                preco: 'Number',
                quantidade: 'Number'
              }
            }
          }
        }
        return res.status(202).send(response)
      }
    )
  })
}
