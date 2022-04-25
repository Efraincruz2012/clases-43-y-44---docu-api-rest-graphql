let mongoose;
let Schema;
let ProductSchema;
let ProductModel;

const { mongooseLib } = require('../../config/mongodb_config.js');
mongoose = mongooseLib;
Schema = mongoose.Schema;

ProductSchema = new Schema({
    name: {type: String, required: true},
    thumbnail: String,
    price: String
}, {collection: 'producto'});

ProductModel = mongoose.model('ProductModel', ProductSchema);

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

class Product {

  constructor() {
    this.db = process.env.DB;
    this.randomNumber = getRandomInt(300, 5000);
  }

  async find(id) {

    return await ProductModel.findById(id);

  }

  async findAll() {

    return await ProductModel.find()
        .then((docs) => {
          return docs;
        });

  }

  async create(data) {

    const doc = new ProductModel({
        name: data.name,
        price: data.price,
        thumbnail: data.thumbnail
    });
    await doc.save();
    return doc;

  }

  async update(data) {

    let updated = {};
    await ProductModel.findByIdAndUpdate(data.id, data).then(doc => updated = doc);
    return updated;

  }

  async delete(id) {
    let updated = {};
    await ProductModel.deleteOne({ _id: id }).then(() => updated = 'product deleted');
    return updated;
  }

};

module.exports = { ProductSchema, Product };
