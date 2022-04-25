const { User } = require('../persistencia/userModel.js');
const { factoryInstance } = require('../persistencia/factory');


class ControladorUsuario {

    userModel;

    constructor(ruta) {
        this.ruta = ruta
        const opcion = process.argv[ 2 ] || 'product';
        if (opcion === 'user') {
            this.userModel = factoryInstance.getModel();
        }
    }

    getModelInstance() {
        if (!this.userModel) {
            this.userModel = new User(); 
        }

        // para comprobar las instancias iguales, se crea un numero aleatorio
        // al momento de instanciar un modelo, y cada vez que se llama su
        // instancia se hace un console log de este numero que es una property
        // de la clase del modelo
        console.log('user number: ', this.userModel.randomNumber);
        return this.userModel;
    }

    async listar(id) {

        return await this.getModelInstance().find(id);

    }

    async listarAll() {

        return await this.getModelInstance().findAll();

    }

    async createUser(data) {

        return await this.getModelInstance().create(data);

    }

}

//Singleton
let userControllerInstance;
const getUserDAO = () => {
    if(!userControllerInstance) {
        userControllerInstance = new ControladorUsuario();
    }
    return userControllerInstance;
}

module.exports = {
    ControladorUsuario,
    getUserDAO
}