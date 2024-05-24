const nodemailer = require('nodemailer')

const htmlCode = (code) => {
    return `
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com"> 
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin> 
        <link href="https://fonts.googleapis.com/css2?family=Jost:wght@100;200;300;400;500&family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,900&family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
        <title>Restaurant Name</title>
    </head>
    <body style="background-color: rgb(15, 15, 15); color: white; max-width: 100vw;">
        <div style="font-family: 'Montserrat'; display: flex; flex-direction: column; align-items: center; max-width: 100vw;">
            <div style="display: flex; flex-direction: column; max-width: 330px; padding: 20px;">
                <div style="font-size: 20px; font-weight: 500; margin-bottom: 20px;">Восстановление доступа к аккаунту Restaurant Name</div>
                <div style="height: 1px; width: 50px; width: 100%; background-color: white; margin-bottom: 20px;"></div>
                <div style="margin-bottom: 30px;">Введите код на устройстве, с которого запрашиваете восстановление:</div>
                <div style="font-weight: 600; margin-bottom: 30px;">${code}</div>
                <div style="margin-bottom: 30px;"><span style="font-weight: 700;">Если вы этого не делали</span>, проигнорируйте это письмо.</div>
                <div>С уважением,</div>
                <div>Restaurant Name</div>
            </div>
        </div>
    </body>
    </html>
`
}

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async sendCode(to, code) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Восстановление доступа к аккаунту Restaurant Name',
            text: '',
            html: htmlCode(code)
        })
    }
}

module.exports = new MailService()