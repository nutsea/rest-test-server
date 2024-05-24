const ApiError = require('../error/apiError')
const { Order } = require('./../models/models')

class OrderController {
    async create(req, res, next) {
        const { items_array, street, apartment, entrance, floor, intercom, name, phone, comment, payment, cost, user_id } = req.body
        let user = user_id ? user_id : null
        const order = await Order.create({ items_array, street, apartment, entrance, floor, intercom, name, phone, comment, payment, cost, user_id: user})
        return res.json(order)
    }

    async getOne(req, res, next) {
        const { order_id } = req.query
        const order = await Order.findOne({ where: { id: order_id } })
        return res.json(order)
    }

    async getAll(req, res, next) {
        const orders = await Order.findAll()
        return res.json(orders)
    }

    async getOrdersByUser(req, res, next) {
        const { id } = req.query
        const orders = await Order.findAll({ where: { user_id: id } })
        return res.json(orders)
    }

    async update(req, res, next) {
        const { id, status, courier } = req.body
        const order = await Order.findOne({ where: { id } })
        if (!order) {
            return next(ApiError.badRequest('Заказ не найден'))
        } else {
            order.status = status
            if (courier) {
                order.courier_id = courier
            }
            await order.save()
            return res.json(order)
        }
    }
}

module.exports = new OrderController()