const sequelize = require('./../db.js')
const { DataTypes, ARRAY } = require('sequelize')
const { v4: uuidv4 } = require('uuid')

const User = sequelize.define('users', {
    id: { type: DataTypes.UUID, defaultValue: uuidv4, primaryKey: true, allowNull: false, unique: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false },
    password: { type: DataTypes.STRING(255) },
    role: { type: DataTypes.STRING(255) }
})

const Courier = sequelize.define('couriers', {
    id: { type: DataTypes.UUID, defaultValue: uuidv4, primaryKey: true, allowNull: false, unique: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    phone: { type: DataTypes.STRING(11), allowNull: false }
})

const Item = sequelize.define('items', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT },
    weight: { type: DataTypes.INTEGER },
    price: { type: DataTypes.INTEGER, allowNull: false },
    img: { type: DataTypes.STRING }
})

const Category = sequelize.define('categories', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    place: { type: DataTypes.INTEGER, allowNull: false }
})

const Order = sequelize.define('orders', {
    id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    items_array: { type: ARRAY(DataTypes.STRING) },
    street: { type: DataTypes.STRING(255), allowNull: false },
    apartment: { type: DataTypes.STRING(255) },
    entrance: { type: DataTypes.STRING(255) },
    floor: { type: DataTypes.STRING(255) },
    intercom: { type: DataTypes.STRING(255) },
    name: { type: DataTypes.STRING(255), allowNull: false },
    phone: { type: DataTypes.STRING(255), allowNull: false },
    comment: { type: DataTypes.STRING(255) },
    payment: { type: DataTypes.STRING(255), allowNull: false },
    cost: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING(255), defaultValue: 'Оформлен' }
})

Category.hasMany(Item, { foreignKey: 'category_id' })
Item.belongsTo(Category, { foreignKey: 'category_id' })

Courier.hasMany(Order, { foreignKey: 'courier_id' })
Order.belongsTo(Courier, { foreignKey: 'courier_id' })

User.hasMany(Order, { foreignKey: 'user_id' })
Order.belongsTo(User, { foreignKey: 'user_id' })

module.exports = {
    User,
    Item,
    Category,
    Order,
    Courier
}