

/*

Lista de queries: 


// para obtener un producto: (cambiar el id por uno que si exista en la bd)
query{
    getProducto(id: "620a68b73f3d59efd2794baa") {
        id
        name
        thumbnail
        price
    }
}

// obtener muchos productos
query{
    getProductos {
        id
        name
        thumbnail
        price
    }
}

// crear un producto
mutation {
  createProducto(datos: {
    name: "Arcor",
    thumbnail: "test",
    price: 100
  }) {
    id
  }
}

// edicion de un producto
mutation {
  editProducto(id: "620a68b73f3d59efd2794baa", datos: {
    name: "Manaos editado",
    thumbnail: "test",
    price: 155
  }) {
    id
  }
}

// eliminar un producto
mutation {
  deleteProducto(id: "6260b2d3de0cee8a70690be8") {
      message
  }
}

// queries para los usuarios


// Login
query {
  login(datos: {nombre: "efra", password: "123"}) {
    __typename
    ... on Error {
      error
    }
    ... on SessionData {
      token
      nombre
    }
  }
}

// Registro de usuario
query {
  registerUser(datos: {
    nombre: "user123_19",
    password: "user123_19",
    email: "user123_19@gmail.com",
    age: "15",
    address: "direccion de su casa",
    countrycode: "+54",
    phone: "44444",
    picturePath: "/picture.jpg"
  }) {
    __typename
    ... on Error {
      error
    }
    ... on SessionData {
      token
      nombre
    }
  }
}

*/
