const ApiError = require('../error/apiError')
const { User } = require('../models/models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')

const generateJwt = (id, email, role) => {
    return jwt.sign(
        { id, email, role },
        process.env.SECRET_KEY,
        { expiresIn: '30d' }
    )
}

class UserController {
    async create(req, res, next) {
        const { name, email, password, role } = req.body
        const isUser = await User.findOne({ where: { email } })
        if (isUser) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({ name, email, password, role, password: hashPassword })
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({ user, token })
    }

    async login(req, res, next) {
        const { email, password } = req.body
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return next(ApiError.badRequest('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.badRequest('Указан неверный пароль'))
        }
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({ token, user })
    }

    async loginAdmin(req, res, next) {
        const { email, password } = req.body
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return next(ApiError.badRequest('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.badRequest('Указан неверный пароль'))
        }
        if (user.role !== 'admin') {
            return next(ApiError.forbidden('Нет доступа'))
        }
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({ token, user })
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        const user = await User.findOne({ where: { email: req.user.email } })
        if (req.user.role === 'admin') {
            return res.json({ token, user })
        } else {
            return next(ApiError.forbidden('Нет доступа'))
        }
    }

    async checkClient(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        const user = await User.findOne({ where: { email: req.user.email } })
        return res.json({ token, user })
    }

    async getUser(req, res, next) {
        const { id } = req.query
        const user = await User.findOne({ where: { id } })
        if (user) {
            return res.json({ user })
        }
        else {
            return next(ApiError.badRequest('Пользователя не существует'))
        }
    }

    async update(req, res, next) {
        const { name, email, password } = req.body
        const user = await User.findOne({ where: { email } })
        if (user) {
            if (name) {
                user.name = name
            }
            if (password) {
                const hashPassword = await bcrypt.hash(password, 5)
                user.password = hashPassword
            }
            await user.save()
            return res.json({ user })
        }
        else {
            return next(ApiError.badRequest('Пользователя не существует'))
        }
    }

    async delete(req, res, next) {
        const { id } = req.body
        const user = await User.findOne({ where: { id } })
        if (user) {
            await user.destroy()
            return res.json({ user })
        }
        else {
            return next(ApiError.badRequest('Пользователя не существует'))
        }
    }
}

module.exports = new UserController()