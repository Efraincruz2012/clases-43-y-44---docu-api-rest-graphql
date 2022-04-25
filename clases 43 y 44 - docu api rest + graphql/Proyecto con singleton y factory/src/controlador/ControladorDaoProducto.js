const { Product } = require('../persistencia/productModel.js');

const { factoryInstance } = require('../persistencia/factory');

class ControladorProducto {

    productModel;

    constructor(ruta) {
        this.ruta = ruta;
        const opcion = process.argv[ 2 ] || 'product';
        if (opcion === 'product') {
            this.productModel = factoryInstance.getModel();
        }
    }

    getModelInstance() {
        if (!this.productModel) {
            this.productModel = new Product(); 
        }

        // para comprobar las instancias iguales, se crea un numero aleatorio
        // al momento de instanciar un modelo, y cada vez que se llama su
        // instancia se hace un console log de este numero que es una property
        // de la clase del modelo
        console.log('product number: ',this.productModel.randomNumber);
        return this.productModel;
    }

    async listar(id) {

        return await this.getModelInstance().find(id);

    }

    async listarAll() {

        return await this.getModelInstance().findAll();

    }

    async createProduct(data) {

        return await this.getModelInstance().create(data);

    }

    async updateProduct(data) {

        return await this.getModelInstance().update(data);

    }

    async deleteProduct(id) {

        return await this.getModelInstance().delete(id);

    }

}
///////////////////////////////////


//Singleton
let productControllerInstance;
const getProductDAO = () => {
    if(!productControllerInstance) {
        productControllerInstance = new ControladorProducto();
    }
    return productControllerInstance;
}

///////////////////////////////
module.exports = {
    ControladorProducto,
    getProductDAO
}