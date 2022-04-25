let mongoose;
let Schema;
let CarritoSchema;
let CarritoModel;

let { Product, ProductSchema } = require('./productModel.js');

const { mongooseLib } = require('../../config/mongodb_config.js');
mongoose = mongooseLib;
Schema = mongoose.Schema;

CarritoSchema = new Schema({
    id: String,
    productos: [{type: ProductSchema}]
  }, {collection: 'carrito'});
CarritoModel = mongoose.model('CarritoModel', CarritoSchema);

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

class Carrito {

  constructor() {
    this.product = new Product();
    this.randomNumber = getRandomInt(300, 5000);
  }

  async find(id) {

    // Busco el carrito
    return await CarritoModel.findById(id);

  }

  async findAll() {

      // mongoose
      return await CarritoModel.find()
          .then((docs) => {
            return docs;
          });
  }

  async create() {

      // mongoose
      const doc = new CarritoModel();
      await doc.save(function(_err, carrito) {
          console.log(carrito.id);
      });
      return doc;

  }

  async addProduct(data) {

    // mongoose
    const producto = await this.product.find(data.productId);

    // Busco el carrito
    let doc = await CarritoModel.findById(data.carritoId);

    // le añado el producto y lo guardo
    doc.overwrite({ productos: [...doc.productos, producto], ...doc});
    await doc.save();

    return true;

  }

  async removeAllProducts(data) {

    // Busco el carrito
    let doc = await CarritoModel.findById(data.carritoId);

    // le añado el producto y lo guardo
    doc.overwrite({ productos: [], ...doc});
    await doc.save();

    return true;

  }

};

module.exports = Carrito;