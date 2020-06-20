import {
  INTEGER,
  STRING,
  ENUM,
  FLOAT,
  Op,
  literal,
  Model,
} from 'sequelize';

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

class HelpRequest extends Model {
  static init(sequelize) {
    super.init(
      {
        fromUser: INTEGER,
        assignedUser: INTEGER,
        description: STRING,
        priority: INTEGER,
        status: INTEGER,
        locationLatitude: FLOAT,
        locationLongitude: FLOAT,
        helpType: ENUM('groceries', 'transport', 'medicine', 'other'),
        timeOptions: STRING,
        deliveryOption: ENUM('door', 'porch', 'drone'),
        paymentOption: ENUM('cash', 'card', 'swish'),
      },
      { sequelize, underscored: false, tableName: 'help_requests' },
    );

    return this;
  }

  static async searchForInNeed(latitude, longitude, user) {
    const radius = 5000; // 5km
    const skillToHelpType = {};
    skillToHelpType[SKILL_SHOPPER] = HELP_TYPE_SHOP;
    skillToHelpType[SKILL_DRIVER] = HELP_TYPE_TRANSPORT;
    skillToHelpType[SKILL_PICKER] = HELP_TYPE_MEDICINE;
    skillToHelpType[SKILL_SHOPPER] = HELP_TYPE_OTHER;
    const helpTypes = [];
    for (const item of user.getDataValue('skills').split('|')) {
      if (skillToHelpType[item]) {
        helpTypes.push(skillToHelpType[item]);
      }
    }
    try {
      const helpRequests = await HelpRequest.findAll({
        attributes: {
          include: [
            [literal(`ST_Distance_Sphere(point(${longitude}, ${latitude}),point(locationLongitude, locationLatitude))`), 'distance'],
          ],
        },
        where: { assignedUser: null, status: REQUEST_STATUS_INIT, helpType: helpTypes },
        having: { distance: { [Op.lt]: radius } },
      });

      return helpRequests;
    } catch (err) {
      throw err;
    }
  }
}

export default HelpRequest;
