const Router = require('express')
const router = new Router()
const categoryController = require('../controllers/categoryController')

router.get('/', categoryController.getAll)
router.post('/', categoryController.create)
router.post('/change', categoryController.change)
router.post('/changeplace', categoryController.changePlace)
router.delete('/', categoryController.delete)

module.exports = router