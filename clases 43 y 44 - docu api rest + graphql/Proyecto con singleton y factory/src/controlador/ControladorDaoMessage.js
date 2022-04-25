const { Message } = require('../persistencia/messageModel.js');

const { factoryInstance } = require('../persistencia/factory');

class ControladorMessage {

    messageModel;

    constructor(ruta) {
        this.ruta = ruta;
        const opcion = process.argv[ 2 ] || 'product';
        if (opcion === 'message') {
            this.messageModel = factoryInstance.getModel();
        }
    }

    getModelInstance() {
        if (!this.messageModel) {
            this.messageModel = new Message(); 
        }

        return this.messageModel;
    }

    async listar(id) {

        return await this.getModelInstance().find(id);

    }

    async listarAll() {

        return await this.getModelInstance().findAll();

    }

    async createMessage(data) {
        return await this.getModelInstance().create(data);

    }

}
///////////////////////////////////


//Singleton
let messageControllerInstance;
const getMessageDAO = () => {
    if(!messageControllerInstance) {
        messageControllerInstance = new ControladorMessage();
    }
    return messageControllerInstance;
}

///////////////////////////////
module.exports = {
    ControladorMessage,
    getMessageDAO
}