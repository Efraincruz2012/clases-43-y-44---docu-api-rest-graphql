const { Router } = require('express');
const { getProductDAO } = require('../controlador/ControladorDaoProducto');

const routerProducto = Router();

const productController = getProductDAO();

/* GraphQL functions starts here: */

const parseProductToGraphQL = product_raw => ({
    id: product_raw._id.toString(),
    name: product_raw.name,
    thumbnail: product_raw.thumbnail,
    price: isNaN(parseInt(product_raw.price)) ? null : parseInt(product_raw.price)
});

const listarAllProducts = async () => {

    const productos_raw = await productController.listarAll();

    const productos = productos_raw.map(parseProductToGraphQL)
    return productos;
}

const listarProduct = async ({ id }) => {

    const product_raw = await productController.listar(id);
    return parseProductToGraphQL(product_raw);
}

const createProduct = async ({ datos }) => {
    const product_raw = await productController.createProduct(datos);
    return parseProductToGraphQL(product_raw);
}

const editProduct = async ({ id, datos }) => {
    const newProductData = {
        id:  id,
        name: datos.name,
        thumbnail: datos.thumbnail,
        price: parseFloat(datos.price)
    };
    return await productController.updateProduct(newProductData);
}

const deleteProduct = async ({ id }) => {
    await productController.deleteProduct(id);

    return {
        message:`product deleted: ${id}`
    };
}

/* GraphQL functions ends here--- */


routerProducto.get('/', async (req, res) => {
    req.loggerBase(req);
    const productos = await productController.listarAll();
    res.send(productos);
})

routerProducto.get('/:id', async (req, res) => {
    req.loggerBase(req);
    const producto = await productController.listar(req.params.id);
    res.send(producto);

});

routerProducto.delete('/:id', async (req, res) => {
    req.loggerBase(req);
    const producto = await productController.deleteProduct(req.params.id);
    res.send(producto);
});

routerProducto.post('/',async (req, res) => {
    req.loggerBase(req);
    // Si en el query viene edit entonces se actualiza el producto
    // esto es por que los formularios no dejan usar el method put
    // entonces hay que decirle al backend de otra forma que es un update
    // en este caso usando el queryString edit (mirar la ruta el formulario en html)
    if (req.query.edit) {
        try{
            const newProductData = {
                id:  req.body.id,
                name: req.body.name,
                thumbnail: req.body.thumbnail,
                price: parseFloat(req.body.price)
            };

            await productController.updateProduct(newProductData);
            res.send(`Producto actualizado: ${newProductData}`);
        }catch(e){
            res.send(`Error: ${e}`);
        }
    } else {

        await productController.createProduct(req.body);
        
        return res.status(204).json();
    }
    
})

routerProducto.use(function(req, _res) {
    // Invalid request
    const { originalUrl, method } = req
    req.loggerWarning(`Ruta ${method} ${originalUrl} no implementada`);
});

module.exports = {
    routerProducto,
    listarAllProducts,
    listarProduct,
    createProduct,
    editProduct,
    deleteProduct
};
