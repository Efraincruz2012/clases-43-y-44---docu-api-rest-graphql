const nodemailer = require('nodemailer');
const twilio = require('twilio');

function createSendMail(mailConfig) {

  const transporter = nodemailer.createTransport(mailConfig);

  return function sendMail({ to, subject, text, html }) {
    const mailOptions = { from: mailConfig.auth.user, to, subject, text, html };
    return transporter.sendMail(mailOptions)
  }
}

function createSendMailEthereal() {
  return createSendMail({
    service: process.env.MAIL_SERVICE,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.AUTH_GMAIL_EMAIL,
      pass: process.env.AUTH_GMAIL_PASSWORD,
    },
  })
}

const sendMail = createSendMailEthereal();

const mailTo = async ({to, subject, message}) => {
  const info = await sendMail({
    to,
    subject,
    html: message
  })
}

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const whatsappTo = message => {
  return client.messages.create(message);
}

module.exports = {
  mailTo,
  whatsappTo
}