import {
  INTEGER,
  STRING,
  Model,
} from 'sequelize';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        fromUser: INTEGER,
        toUser: INTEGER,
        value: INTEGER,
        comment: STRING,
      },
      { sequelize, underscored: false, tableName: 'user_ratings' },
    );

    return this;
  }
}

export default User;
