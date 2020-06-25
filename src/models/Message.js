import {
  INTEGER,
  STRING,
  Model,
} from 'sequelize';

class Message extends Model {
  static init(sequelize) {
    super.init(
      {
        fromUser: INTEGER,
        toUser: INTEGER,
        helpRequest: INTEGER,
        title: STRING,
        content: STRING,
      },
      { sequelize, underscored: false, tableName: 'messages' },
    );

    return this;
  }
}

export default Message;
