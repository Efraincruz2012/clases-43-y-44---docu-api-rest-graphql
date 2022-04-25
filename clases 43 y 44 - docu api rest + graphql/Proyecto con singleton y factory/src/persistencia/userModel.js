const { mongooseLib } = require('../../config/mongodb_config.js');
const { getCarritoDAO } = require('../controlador/ControladorDaoCarrito.js');
mongoose = mongooseLib;

const { mailTo } = require('../negocio/mailHandler');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    nombre: String,
    password: String,
    email: String,
    age: String,
    address: String,
    phone: String,
    picture: String,
    carritoid: String
}, {collection: 'user'});

const UserModel = mongoose.model('UserModel', userSchema);

const carritoController = getCarritoDAO();

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

class User {

    constructor() {
      this.db = process.env.DB;

      // para comprobar que se mantiene la instancia
      this.randomNumber = getRandomInt(300, 5000);
    }
  
    async find(id) {
  
      return await UserModel.findById(id);
  
    }
  
    async findAll() {
  
      return await UserModel.find()
          .then((docs) => {
            return docs;
          });
  
    }
  
    async create(data) {

			const carrito = await carritoController.create();

      const doc = new UserModel({
        nombre: data.nombre,
        password: data.password,
        email: data.email,
        age: data.age,
        address: data.address,
        phone: data.phone,
        picture: data.picture,
        carritoid: carrito._id.toString()
      });

      // Enviar mail
      // try {
      //   mailTo({
      //     to: process.env.ADMIN_MAIL,
      //     subject: 'Nuevo Registro',
      //     message: `<div>Usuario creado: 
      //       Nombre: ${data.nombre} <br>
      //       Email: ${data.email} <br>
      //       Edad: ${data.age} <br>
      //       Dirección: ${data.address} <br>
      //       Teléfono: ${data.phone} <br>
      //     </div>`
      //   })
      // } catch (error) {
      //   console.log(error);
      // }

      await doc.save();
      return doc;
  
    }
  
    async update(data) {
  
      let updated = {};
      await ProductModel.findByIdAndUpdate(data.id, data).then(doc => updated = doc);
      return updated;
  
    }
  
  };


module.exports = { User };
