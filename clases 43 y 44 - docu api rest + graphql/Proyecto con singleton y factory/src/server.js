const express = require('express')
const path = require('path')
const cluster = require('cluster')
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema')

const {
  withLogger,
  loggerWarning,
} = require('./negocio/loggers')

require('dotenv').config()

const { startWebsockets } = require('./negocio/chat');

const yargs = require('yargs/yargs')(process.argv.slice(2))

const argumentosEntrada = yargs
.boolean('debug')
.alias({
  p: 'puerto',
  f: 'FORK',
  c: 'CLUSTER'
})
.default({
  puerto: 8080,
  FORK: 'on',
  CLUSTER: 'off', 
}).argv;

const {
  routerProducto,
  listarAllProducts,
  listarProduct,
  createProduct,
  editProduct,
  deleteProduct
} = require("./rutas/producto")
 
const { routerCarrito } = require("./rutas/carrito")

const {
  routerUsuario,
  loginUser,
  registerUser
} = require("./rutas/usuario")

const { routerInfo } = require('./rutas/info')

const { routerTienda } = require('./rutas/tienda');

const { routerChat } = require('./rutas/chat');

 
const app = express()

app.use(express.json())

app.use(cors())

app.use(express.urlencoded({ extended: true }))

app.use(cookieParser());

app.use(express.static('public'))
app.use('/imagenes', express.static('imagenes'));

app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'ejs');


const typeDefs = `
  input ProductoInput {
    name: String,
    thumbnail: String,
    price: Int
  }
  type Producto {
    id: ID!
    name: String,
    thumbnail: String,
    price: Int
  }
  type ProductDeleteOutput {
    message: String
  }
  input UserAuthInput {
    nombre: String,
    password: String 
  }
  input NewUserInput {
    nombre: String,
    password: String,
    email: String,
    age: String,
    address: String,
    countrycode: String,
    phone: String,
    picturePath: String
  }
  type SessionData {
    token: String,
    nombre: String,
    picture: String
  }
  type Error {
    error: String
  }
  union SessionResult = SessionData | Error
  type User {
    id: ID!
    nombre: String,
    password: String,
    email: String,
    age: String,
    address: String,
    phone: String,
    picture: String,
    carritoid: String
  }
  type Query {
    getProductos: [Producto],
    getProducto(id: ID!): Producto,
    login(datos: UserAuthInput): SessionResult,
    registerUser(datos: NewUserInput): SessionResult
  }
  type Mutation {
    createProducto(datos: ProductoInput): Producto
    editProducto(id: ID!, datos: ProductoInput): Producto
    deleteProducto(id: ID!): ProductDeleteOutput
  }
`;

const resolvers = {
  SessionResult: {
    __resolveType: result => {
      if (result.error){
        return 'Error';
      }
      return 'SessionData';
    },
  },
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: {
      getProductos: listarAllProducts,
      getProducto: listarProduct,
      createProducto: createProduct,
      editProducto: editProduct, 
      deleteProducto: deleteProduct,
      login: loginUser,
      registerUser
    },
    graphiql: true,
  })
)

// listarAllProducts


/* ------------------------------------------------------ */
/* Cargo los routers */

app.use('/api/productos', withLogger, routerProducto)
 
app.use('/api/carrito', withLogger, routerCarrito)

app.use('/info', withLogger, routerInfo)

app.use('/chat', withLogger, routerChat);

app.use('/', withLogger, routerTienda);

app.use('/', routerUsuario);


app.use(function(req, _res) {
  // Maneja requests invalidos
  const { originalUrl, method } = req
  loggerWarning(`Ruta ${method} ${originalUrl} no implementada`);
});

/* ------------------------------------------------------ */
/* Server Listen */

const { puerto, CLUSTER } = argumentosEntrada; 

if(CLUSTER.toLowerCase() === 'on'){
  // modo cluster
  const server = app.listen(puerto, () => {
    console.log(`Servidor escuchando en el puerto ${server.address().port} modo CLUSTER`)
  })
  server.on('error', error => console.log(`Error en servidor ${error}`))
  
  
} else {
  // modo fork

    if (cluster.isPrimary) {

      const numCPUs = require('os').cpus().length;

      for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
        console.log('creando una instancia nueva...')
      }
    
      cluster.on('exit', worker => {
        console.log(
          'Worker',
          worker.process.pid,
          'died',
          new Date().toLocaleString()
        )
        cluster.fork()
      })

    } else {

      const server = app.listen(puerto, () => {
        console.log(`Servidor escuchando en el puerto ${server.address().port} - PID WORKER ${process.pid}`)
      })
      server.on('error', error => console.log(`Error en servidor ${error}`))

      // Iniciar web sockets
      startWebsockets(server);

    }

}



