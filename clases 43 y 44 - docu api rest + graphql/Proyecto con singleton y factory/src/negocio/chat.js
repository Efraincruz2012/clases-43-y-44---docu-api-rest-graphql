const { Server: IOServer } = require('socket.io')
const jwt = require("jsonwebtoken");
const cookie = require('cookie');

const { getMessageDAO } = require('../controlador/ControladorDaoMessage');

const messageController = getMessageDAO();

const startWebsockets = httpServer => {

  const io = new IOServer(httpServer)

  io.on('connection', socket => {
    console.log('Nuevo cliente conectado!')

    const cookies = cookie.parse(socket.handshake.headers.cookie);

    // enviar lista de mensajes al cliente
    // socket.emit('mensajes', normalizarMensajes(mensajes))
    
    // socket.emit('contadorActualizado', contador) 

    socket.on('getMessages', async email => {

      if (email) {

        const messages = await messageController.listarAll();

        const messagesByEmail = messages.filter(item => item.author.email === email);

        socket.emit('updateMessages', messagesByEmail);

      } else {
        const messages = await messageController.listarAll();
        socket.emit('updateMessages', messages);

      }

    });
    
    socket.on('newMessage', async message => {

        // obtener usuario del token de sesion
        const token = cookies['user'];
        let authenticatedUser;
        jwt.verify(token, process.env.PRIVATE_KEY, (_err, decoded) => {
          authenticatedUser = decoded.data;
        });

        const messageComplete = {
          author: {
            name: authenticatedUser.nombre,
            avatar: authenticatedUser.picture,
            email: authenticatedUser.email
          },
          message: message.value
        };

        await messageController.createMessage(messageComplete);

    })

  })

}

module.exports = {
  startWebsockets
}