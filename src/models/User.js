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

const REQUEST_STATUS_INIT = 0;
const REQUEST_STATUS_ACCEPTED = 1;
const REQUEST_STATUS_DONE = 2;

const HELP_TYPE_SHOP = 'groceries';
const HELP_TYPE_TRANSPORT = 'transport';
const HELP_TYPE_MEDICINE = 'medicine';
const HELP_TYPE_OTHER = 'other';

const DELIVERY_DOOR = 'door';
const DELIVERY_PORCH = 'porch';
const DELIVERY_DRONE = 'drone';

const DELIVERY_CASH = 'cash';
const DELIVERY_CARD = 'card';
const DELIVERY_SWISH = 'swish';

const ROLE_HELPER = 'helper';
const ROLE_INNEED = 'inneed';
const ROLE_ADMIN = 'admin';
const SKILL_DRIVER = 'driver';
const SKILL_PICKER = 'picker';
const SKILL_SHOPPER = 'shopper';

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
      if (user.password) {
        user.passwordHash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.passwordHash);
  }

  static isTheSame(userId, authUser) {
    return userId == authUser.id;
  }

  static isAdmin(user) {
    return user.type == ROLE_ADMIN;
  }

  static async searchForHelpers(latitude, longitude, helpType) {
    const radius = 5000; // 5km
    const helpTypeToSkill = {};
    helpTypeToSkill[HELP_TYPE_SHOP] = SKILL_SHOPPER;
    helpTypeToSkill[HELP_TYPE_TRANSPORT] = SKILL_DRIVER;
    helpTypeToSkill[HELP_TYPE_MEDICINE] = SKILL_PICKER;
    helpTypeToSkill[HELP_TYPE_OTHER] = SKILL_SHOPPER;
    try {
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
    } catch (err) {
      throw err;
    }
  }
}

export default User;
