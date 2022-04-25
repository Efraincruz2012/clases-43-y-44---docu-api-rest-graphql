const { Router } = require('express');
// const { getCarritoDAO } = require('../controlador/ControladorDaoCarrito');

const { auth } = require('../negocio/auth');

const routerChat = Router();

routerChat.get('/', auth, async (req, res) => {
    req.loggerBase(req);

    res.render('chat',{ name: req.user.nombre, picture: req.user.picture, messages: []  });
})

routerChat.get('/:email', auth, async (req, res) => {
  req.loggerBase(req);

  res.render('chat',{ name: req.user.nombre, picture: req.user.picture, messages: [], onlyEmail: req.params.email });  
})

routerChat.use(function(req, _res) {
    // Invalid request
    const { originalUrl, method } = req
    req.loggerWarning(`Ruta ${method} ${originalUrl} no implementada`);
});


exports.routerChat = routerChat; 