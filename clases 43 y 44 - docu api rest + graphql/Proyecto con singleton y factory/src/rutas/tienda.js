const { Router } = require('express');

const { mailTo, whatsappTo } = require('../negocio/mailHandler');
const { auth } = require('../negocio/auth');

const routerTienda = Router();

const { getProductDAO } = require('../controlador/ControladorDaoProducto');
const { getCarritoDAO } = require('../controlador/ControladorDaoCarrito');

const carritoController = getCarritoDAO();
const productoController = getProductDAO();

routerTienda.get('/productos', async (req, res) => {
  req.loggerBase(req)
  try {
    const productos_raw = await productoController.listarAll();

    const productos = productos_raw.map((producto, index) => ({
      id: index + 1,
      originalId: producto.id,
      name: producto.name,
      price: producto.price
    }));

    res.render('productos', { productos });
  } catch (error) {
    req.loggerError(error);
  }
});

routerTienda.get('/carrito', auth, async (req, res) => {
  req.loggerBase(req)
  try {
    const carrito = await carritoController.getCarritoById(req.user.carritoid);
  
    const responseObject = {
      carritos: [carrito]
    };

    if (typeof req.query.info !== 'undefined' && req.query.info === 'compra'){
      responseObject['info'] = 'Compra exitosa!';
    }

    res.render('carrito', responseObject);
  } catch (error) {
    req.loggerError(error);
  }
});

routerTienda.get('/comprar', auth, async (req, res) => {
  req.loggerBase(req)

  // carrito del usuario actual
  const carritoActual = await carritoController.getCarritoById(req.user.carritoid);

  //crear lista de productos del usuario
  let mailContent = '';

  for (const prod of carritoActual.productos) {
    mailContent += `
      <li>${prod.name} ${prod.price}</li>
    `;
  }

  let whatsappContent = '';

  for (const prod of carritoActual.productos) {
    whatsappContent += `
      ${prod.name} ${prod.price}
    `;
  }
  
  await carritoController.removeAllProductsFromCar(req.user.carritoid).then(async (_any) => {

    mailTo({
      to: process.env.ADMIN_MAIL,
      subject: `Nuevo pedido de ${req.user.nombre} ${req.user.email}`,
      message: `<div>Productos: 
        <ul>
          ${mailContent}
        </ul>
      </div>`
    });

    const mensajeWhatsapp = {
      body: `Nuevo Pedido de ${req.user.nombre} ${req.user.email} 
      
      Productos: 
        ${whatsappContent}
      `,
      from: `whatsapp:+14155238886`,
      to: process.env.WHATSAPP_RECEPTOR ,
      //to: `whatsapp:+5491168826545`,
    }
    
    try {
      await whatsappTo(mensajeWhatsapp)
    } catch (error) {
      console.log(error)
    }

    res.redirect('/carrito?info=compra');
  });

});

exports.routerTienda = routerTienda;