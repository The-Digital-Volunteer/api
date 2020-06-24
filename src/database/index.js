import Sequelize from 'sequelize';

import { db } from '../../config';
import User from '../models/User';
import UserRating from '../models/UserRating';
import HelpRequest from '../models/HelpRequest';
import Message from '../models/Message';

const models = [User, UserRating, HelpRequest, Message];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(db);
    models.map((model) => model.init(this.connection));
  }
}

export default new Database();
