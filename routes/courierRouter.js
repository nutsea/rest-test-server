const Router = require('express')
const router = new Router()
const courierController = require('../controllers/courierController')

router.get('/', courierController.getAll)
router.post('/', courierController.create)
router.delete('/', courierController.delete)

module.exports = router