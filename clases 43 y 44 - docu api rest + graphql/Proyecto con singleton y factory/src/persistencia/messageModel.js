let mongoose;
let Schema;
let MessageSchema;
let AuthorSchema;

const { mongooseLib } = require('../../config/mongodb_config.js');
mongoose = mongooseLib;
Schema = mongoose.Schema;

AuthorSchema = new Schema({
  name: String,
  avatar: String,
  email: String
});

MessageSchema = new Schema({
    author: {type: AuthorSchema, required: true},
    message: String,
}, {collection: 'message'});

MessageModel = mongoose.model('MessageModel', MessageSchema);

class Message {

  constructor() {
    this.db = process.env.DB;
  }

  async find(id) {

    return await MessageModel.findById(id);

  }

  async findAll() {

    return await MessageModel.find()
        .then((docs) => {
          return docs;
        });

  }

  async create(data) {
    const doc = new MessageModel({
        author: data.author,
        message: data.message
    });
    await doc.save();
    return doc;

  }

  async update(data) {

    let updated = {};
    await MessageModel.findByIdAndUpdate(data.id, data).then(doc => updated = doc);
    return updated;

  }

};

module.exports = { MessageSchema, Message };
