const ApiError = require('../error/apiError')
const { Courier } = require('./../models/models')

class CourierController {
    async create(req, res, next) {
        try {
            const { name, phone } = req.body
            const courier = await Courier.create({ name, phone })
            return res.json(courier)
        } catch (e) {
            return next(ApiError.badRequest(e))
        }
    }

    async getAll(req, res, next) {
        const couriers = await Courier.findAll()
        return res.json(couriers)
    }

    async delete(req, res, next) {
        try {
            const { id } = req.query
            const courier = await Courier.findOne({ where: id })
            await courier.destroy()
            return res.json(courier)
        } catch (e) {
            return next(ApiError.badRequest(e))
        }
    }
}

module.exports = new CourierController()