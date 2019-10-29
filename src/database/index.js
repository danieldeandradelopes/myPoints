import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import databaseConfig from '../config/database';
import User from '../app/models/User';
import File from '../app/models/File';
import Account from '../app/models/Account';
import Transaction from '../app/models/Transaction';
import Grid from '../app/models/Grid';
import Unity from '../app/models/Unity';
import Products from '../app/models/Products';
import PictureProducts from '../app/models/PictureProducts';

const models = [
  User,
  File,
  Account,
  Transaction,
  Grid,
  Unity,
  Products,
  PictureProducts,
];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
    });
  }
}

export default new Database();
