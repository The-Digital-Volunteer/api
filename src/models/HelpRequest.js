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

  static async searchForInNeed(radius, latitude, longitude, user) {
    const skillToHelpType = {
      driver: 'groceries',
      picker: 'transport',
      shopper: 'medicine',
    };
    const userSkills = user.getDataValue('skills').split('|');
    const helpTypes = [];
    userSkills.forEach((skill) => {
      if (skillToHelpType[skill]) {
        helpTypes.push(skillToHelpType[skill]);
      }
    });

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
  }
}

export default HelpRequest;
