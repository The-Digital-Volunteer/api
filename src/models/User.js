import {
  INTEGER,
  STRING,
  FLOAT,
  ENUM,
  VIRTUAL,
  Model,
  Op,
  literal,
} from 'sequelize';
import bcrypt from 'bcryptjs';

import UserRating from './UserRating';

const REQUEST_STATUS_DONE = 2;
const ROLE_HELPER = 'helper';
const ROLE_ADMIN = 'admin';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        firstName: STRING,
        lastName: STRING,
        email: STRING,
        bankId: STRING,
        passwordHash: STRING,
        password: VIRTUAL,
        phone: STRING,
        about: STRING,
        avatar: STRING,
        token: STRING,
        status: INTEGER,
        role: ENUM('inneed', 'helper', 'admin'),
        locationLatitude: FLOAT,
        locationLongitude: FLOAT,
        addressStreet: STRING,
        addressPostalCode: STRING,
        addressCity: STRING,
        skills: STRING,
      },
      {
        sequelize,
        underscored: false,
        tableName: 'users',
        scopes: {
          lite: {
            attributes: {
              exclude: [
                'bankId', 'email', 'password', 'locationLatitude', 'locationLongitude', 'createdAt', 'updatedAt',
                'token', 'addressStreet', 'addressCity', 'addressPostalCode', 'status', 'role', 'phone', 'skills',
              ],
            },
          },
          helpRequest: {
            attributes: {
              exclude: [
                'bankId', 'email', 'password', 'locationLatitude', 'locationLongitude', 'createdAt', 'updatedAt', 'token', 'status', 'role', 'skills',
              ],
            },
          },
        },
      },
    );

    this.addHook('beforeCreate', async (user) => {
      const newUser = user;
      if (user.password) {
        newUser.passwordHash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.passwordHash);
  }

  static isTheSame(userId, authUser) {
    return parseInt(userId, 10) === authUser.id;
  }

  static isAdmin(user) {
    return user.type === ROLE_ADMIN;
  }

  static async searchForHelpers(radius, latitude, longitude, helpType) {
    const helpTypeToSkill = {
      groceries: 'shopper',
      transport: 'driver',
      medicine: 'picker',
      other: 'shopper',
    };

    const users = await User.scope('helpRequest').findAll({
      attributes: {
        include: [
          [literal(`ST_Distance_Sphere(point(${longitude}, ${latitude}),point(locationLongitude, locationLatitude))`), 'distance'],
        ],
      },
      where: { role: ROLE_HELPER, skills: { [Op.like]: `%${helpTypeToSkill[helpType]}%` } },
      having: { distance: { [Op.lt]: radius } },
    });

    return users;
  }

  static async getRating(userId) {
    const ratings = await UserRating.findAll({
      where: { toUser: userId },
    });
    const average = (ratingsList) => {
      if (ratingsList.length === 0) return 0;

      const avg = ratingsList
        .map(({ value }) => parseInt(value, 10))
        .reduce((accumulator, rating) => accumulator + rating, 0);

      return avg / (ratingsList.length);
    };
    return {
      total: ratings.length,
      average: average(ratings),
    };
  }

  static async getPendingHelpers(userId) {
    return User.scope('helpRequest').findAll({
      where: literal(`
        User.id IN (
          SELECT assignedUser FROM help_requests
          WHERE fromUser = ${userId}
          AND status = ${REQUEST_STATUS_DONE}
          AND assignedUser NOT IN (
            SELECT toUser FROM user_ratings
            WHERE fromUser = ${userId}
          )
        )
      `),
    });
  }

  static async getPendingInneeds(userId) {
    return User.scope('helpRequest').findAll({
      where: literal(`
        User.id IN (
          SELECT fromUser FROM help_requests
          WHERE assignedUser = ${userId}
          AND status = ${REQUEST_STATUS_DONE}
          AND fromUser NOT IN (
            SELECT toUser FROM user_ratings
            WHERE fromUser = ${userId}
          )
        )
      `),
    });
  }
}

export default User;
