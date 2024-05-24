require('dotenv').config()
const express = require('express')
const sequelize = require('./db.js')
const models = require('./models/models.js')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/index.js')
const http = require('http')
const { Server } = require('socket.io')
const mailService = require('./services/mailService.js')

const PORT = process.env.PORT || 5000

// for linux
// const options = {
//     key: fs.readFileSync('/etc/letsencrypt/live/server.hockeystickstop.com/privkey.pem'),
//     cert: fs.readFileSync('/etc/letsencrypt/live/server.hockeystickstop.com/cert.pem')
// }

const app = express()
app.use(cors())
app.use(express.json())
app.use(fileUpload({}))
app.use(express.static('static'));
app.use('/api', router)

// for linux
// const server = https.createServer(options, app)

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

const generateСode = () => {
    const min = 100000
    const max = 999999
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        
        // not for linux
        server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))

        // for linux
        // server.listen(PORT, () => console.log(`Server started on port ${PORT}`))

        io.on('connection', (socket) => {
            console.log('Подключено')
            let code
            socket.on('submitEmail', async (email) => {
                const user = await models.User.findOne({ where: { email } })
                if (user) {
                    code = generateСode()
                    await mailService.sendCode(email, code)
                    socket.on('submitCode', (clientCode) => {
                        const result = Number(clientCode) === Number(code)
                        socket.emit('result', result)
                    })
                }
            })
        })
    }
    catch (e) {
        console.log(e)
    }
}

start()