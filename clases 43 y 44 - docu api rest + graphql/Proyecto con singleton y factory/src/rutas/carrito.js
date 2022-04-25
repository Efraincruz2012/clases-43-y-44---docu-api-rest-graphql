const { Router } = require('express');
const { getCarritoDAO } = require('../controlador/ControladorDaoCarrito');

const { auth } = require('../negocio/auth');

const routerCarrito = Router();

const carritoController = getCarritoDAO();

routerCarrito.get('/', async (req, res) => {
    req.loggerBase(req);
    const carritos = await carritoController.listarAll();
    res.send(carritos);
    
})

routerCarrito.post('/', async (req, res) => {
    req.loggerBase(req);
    await carritoController.create();
    return res.status(204).json();
})

routerCarrito.post('/product', auth, async (req, res) => {
    req.loggerBase(req);
    await carritoController.addProductToCar(req.body.id_producto, req.user.carritoid);
    res.send({info: 'Producto agregado'});
})

routerCarrito.post('/emptycar', auth, async (req, res) => {
    req.loggerBase(req);
    await carritoController.removeAllProductsFromCar(req.user.carritoid);
    res.send({info: 'Carrito vacio'});
})


routerCarrito.use(function(req, _res) {
    // Invalid request
    const { originalUrl, method } = req
    req.loggerWarning(`Ruta ${method} ${originalUrl} no implementada`);
});


exports.routerCarrito = routerCarrito; 