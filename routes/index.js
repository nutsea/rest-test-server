const Router = require('express')
const router = new Router()
const itemRouter = require('./itemRouter')
const categoryRouter = require('./categoryRouter')
const userRouter = require('./userRouter')
const orderRouter = require('./orderRouter')
const courierRouter = require('./courierRouter')

router.use('/item', itemRouter)
router.use('/category', categoryRouter)
router.use('/user', userRouter)
router.use('/order', orderRouter)
router.use('/courier', courierRouter)

module.exports = router