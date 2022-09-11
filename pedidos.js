const express = require('express')
const router = express.Router()
//VARIAVEL QUE RECEBE OS DADOS DA ROTA
const PedidosController = require('../controller/pedidos-controller')
//RETORNA TODOS OS PEDIDOS
router.get('/', PedidosController.getPedidos)
//RETORNA UM PEDIDO
router.get('/:id_pedidos', PedidosController.getPedidosId)
//INSERE UM PEDIDO
router.post('/', PedidosController.postPedidos)
//MODIFICA UM PEDIDO
router.patch('/', PedidosController.patchPedidos)
//DELETA UM PEDIDO
router.delete('/', PedidosController.deletePedidos)

module.exports = router
