const { Router } = require('express');
const bcrypt = require ('bcrypt');

const { auth, generateToken } = require('../negocio/auth');
const { upload } = require('../negocio/imageHandler');
const { loggerBase } = require('../negocio/loggers');

const { getUserDAO } = require('../controlador/ControladorDaoUsuario');

const usuarioController = getUserDAO();

const routerUsuario = Router();

routerUsuario.get('/', auth, async (req, res) => {
  loggerBase(req)

  try {
    if (req.user)
      res.render('index', { nombre: req.user.nombre, picture: req.user.picture  } );
    else
      res.render('login' );

  } catch (error) {
    loggerError(error);
  }
});

// LOGIN

routerUsuario.get('/login', (req, res) => {
  loggerBase(req)
  res.render('login');

});

const loginUser = async ({ datos }) => {
  const { nombre, password } = datos;

  const usuarios = await usuarioController.listarAll();
  
  const usuario = usuarios.find(usuario => usuario.nombre === nombre);

  if (!usuario) {
    return { error: 'credenciales invalidas' };
  }
  
  let samePassword = await new Promise((resolve, reject) => {

    bcrypt.compare(password, usuario.password, function(err, result) {
      if (err) reject(err)
      resolve(result)
    });
  
  });

  if (!samePassword) {
    return { error: 'credenciales invalidas' };
  }

  const access_token = generateToken(usuario)

  return {
    token: access_token,
    nombre: usuario.nombre,
    picture: usuario.picture
  };
}

routerUsuario.post('/login', async (req, res) => {
  loggerBase(req)

  const result = await loginUser({ datos: req.body });

  if (result.error) {
    return res.render('login', result);
  }
  
  res.render('index', result);
})

routerUsuario.get('/logout', (req, res) => {
  loggerBase(req)
  res.render('login', { action: 'logout' });
})

const registerUser = async ({ datos }) => {
  const {
    nombre,
    password,
    email,
    age,
    address,
    countrycode,
    phone,
    picturePath
  } = datos;

  const usuarios = await usuarioController.listarAll();
  
  const usuario = usuarios.find(usuario => usuario.nombre == nombre)
  if (usuario) {
    return { error: 'ya existe ese usuario' };
  }

  const saltRounds = 10;
  let passwordCodificado = '';
  
  const fullphone = `+${countrycode}${phone}`;

  let nuevoUsuario;

  let createUserFromRawData = () => new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, function(_err, salt) {
      bcrypt.hash(password, salt, async function(_err, hash) {
        // Store hash in database here
        passwordCodificado = hash;
  
        nuevoUsuario = {
          nombre,
          password: passwordCodificado,
          email,
          age,
          address,
          phone: fullphone,
          picture: picturePath, 
        }
        
        let user;
        let access_token;
        try {
          user = await usuarioController.createUser(nuevoUsuario);
          
          nuevoUsuario.carritoid = user.carritoid;
    
          access_token = generateToken(nuevoUsuario);
          
        } catch (error) {
          reject({ error });
        }
  
        resolve({token: access_token, nombre, picture: picturePath });
  
      });
    });

  });

  const response = await createUserFromRawData();
  
  return response;
};

// REGISTER
routerUsuario.post('/registro', upload.single('profile-picture'), async (req, res) => {
  loggerBase(req)

  const dataRaw = {...req.body, picturePath: req.file.path};

  const resultado = await registerUser({datos: dataRaw});

  if (resultado.error) {
    return res.json(resultado);
  }

  res.render('index', resultado);

})

routerUsuario.get('/registro', (req, res) => {
  loggerBase(req)
  res.render('registro');
});

module.exports = {
  routerUsuario,
  loginUser,
  registerUser
}
