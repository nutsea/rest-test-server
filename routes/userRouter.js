const Router = require('express')
const userController = require('../controllers/userController')
const router = new Router()
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', userController.create)
router.post('/login', userController.login)
router.post('/loginadmin', userController.loginAdmin)
router.get('/auth', authMiddleware, userController.check)
router.get('/authclient', authMiddleware, userController.checkClient)
router.get('/', userController.getUser)
router.post('/change', userController.update)

module.exports = router