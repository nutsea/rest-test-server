const Router = require('express')
const router = new Router()
const itemController = require('../controllers/itemController')

router.get('/', itemController.getOneCategory)
router.get('/one', itemController.getOne)
router.post('/', itemController.create)
router.post('/change', itemController.change)
router.delete('/', itemController.delete)

module.exports = router