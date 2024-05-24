const Router = require('express')
const router = new Router()
const orderController = require('../controllers/orderController')

router.post('/', orderController.create)
router.get('/', orderController.getOne)
router.get('/all', orderController.getAll)
router.get('/user', orderController.getOrdersByUser)
router.post('/status', orderController.update)

module.exports = router