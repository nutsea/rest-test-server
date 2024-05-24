const ApiError = require('../error/apiError')
const { Category, Item } = require('../models/models')
const { Sequelize } = require('sequelize')

class CategoryController {
    async create(req, res, next) {
        const { name } = req.body
        const isExist = await Category.findOne({ where: { name } })
        if (!isExist) {
            const maxPlaceCategory = await Category.findOne({
                attributes: [[Sequelize.fn('max', Sequelize.col('place')), 'maxPlace']],
            })
            const newPlaceValue = (maxPlaceCategory.getDataValue('maxPlace') || 0) + 1
            const category = await Category.create({ name, place: newPlaceValue })
            return res.json(category)
        } else {
            return next(ApiError.badRequest('Такая категория уже существует'))
        }
    }

    async delete(req, res, next) {
        const { id } = req.query
        const category = await Category.findOne({ where: { id } })
        const items = await Item.findAll({ where: { category_id: id } })
        if (category) {
            await category.destroy()
            if (items) {
                for (let i of items) {
                    i.category_id = null
                    await i.save()
                }
            }
            return res.json(category)
        } else {
            return next(ApiError.badRequest('Данной категории не существует'))
        }
    }

    async change(req, res, next) {
        const { id, name } = req.body
        let category = await Category.findOne({ where: { id } })
        console.log(category)
        if (category) {
            category.name = name
            await category.save()
            return res.json(category)
        } else {
            return next(ApiError.badRequest('Данной категории не существует'))
        }
    }

    async changePlace(req, res, next) {
        const { id, place } = req.body
        let category = await Category.findOne({ where: { id } })
        if (category) {
            category.place = place
            await category.save()
            return res.json(category)
        } else {
            return next(ApiError.badRequest('Данной категории не существует'))
        }
    }

    async getAll(req, res, next) {
        const categories = await Category.findAll()
        return res.json(categories)
    }
}

module.exports = new CategoryController()