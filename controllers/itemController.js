const ApiError = require('../error/apiError')
const { Item, Category } = require('../models/models')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
const fs = require('fs')

class ItemController {
    async create(req, res, next) {
        try {
            const { name, description, weight, price, category_id } = req.body
            let file = false
            let fileName
            try {
                const { img } = req.files
                fileName = uuidv4() + ".jpg"
                img.mv(path.resolve(__dirname, '..', 'static', fileName))
                file = true
            } catch (e) {
                console.log(e)
            }
            const category = await Category.findOne({ where: { id: category_id } })
            if (category) {
                const item = await Item.create({ name, description, weight, price, category_id, img: file ? fileName : '' })
                return res.json(item)
            } else {
                return next(ApiError.badRequest('Данной категории не существует'))
            }
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async change(req, res, next) {
        try {
            const { id, name, description, weight, price, category_id } = req.body
            const numId = Number(id)
            let item = await Item.findOne({ where: { id: numId } })
            if (name) item.name = name
            if (description) item.description = description
            else item.description = null
            if (weight) item.weight = weight
            else item.weight = null
            if (price) item.price = price
            if (category_id) {
                const category = await Category.findOne({ where: { id: category_id } })
                if (category) item.category_id = category_id
            }
            let file = false
            let fileName
            try {
                const { img } = req.files
                if (img) {
                    if (item.img.length > 0) {
                        const filePath = path.resolve(__dirname, '..', 'static', item.img)
                        fs.unlink(filePath, (e) => {
                            if (e) {
                                console.log('Ошибка при удалении файла:', e)
                            } else {
                                console.log('Файл успешно удален')
                            }
                        })
                    }
                }
                fileName = uuidv4() + ".jpg"
                img.mv(path.resolve(__dirname, '..', 'static', fileName))
                file = true
                item.img = fileName
            } catch (e) {

            }
            await item.save()
            return res.json(item)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getOneCategory(req, res, next) {
        const { category_id } = req.query
        const items = await Item.findAll({ where: { category_id } })
        return res.json(items)
    }

    async getOne(req, res, next) {
        const { id } = req.query
        const item = await Item.findOne({ where: { id } })
        return res.json(item)
    }

    async delete(req, res, next) {
        const { id } = req.query
        const item = await Item.findOne({ where: { id } })
        if (item) {
            if (item.img.length > 0) {
                const filePath = path.resolve(__dirname, '..', 'static', item.img)
                fs.unlink(filePath, (e) => {
                    if (e) {
                        console.log('Ошибка при удалении файла:', e)
                    } else {
                        console.log('Файл успешно удален')
                    }
                })
            }
            await item.destroy()
            return res.json(item)
        } else {
            return next(ApiError.badRequest('Данной позиции не существует'))
        }
    }
}

module.exports = new ItemController()