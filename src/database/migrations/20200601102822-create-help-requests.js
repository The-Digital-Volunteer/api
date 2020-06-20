
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('help_requests', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    fromUser: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    assignedUser: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    description: {
      type: Sequelize.STRING(4096),
      allowNull: true,
    },
    priority: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
    // Created=0, Assigned&Accepted=1, Done=2
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 2,
      },
    },
    locationLatitude: {
      type: Sequelize.FLOAT(9, 6),
      allowNull: true,
    },
    locationLongitude: {
      type: Sequelize.FLOAT(9, 6),
      allowNull: true,
    },
    helpType: {
      type: Sequelize.ENUM('groceries', 'transport', 'medicine', 'other'),
      allowNull: true,
    },
    // pipe-separeted list of time-ranges: 10:00-11:00|12:00-13:00|19:00-20:00|20:00-21:00
    timeOptions: {
      type: Sequelize.STRING(4096),
      allowNull: true,
    },
    deliveryOption: {
      type: Sequelize.ENUM('door', 'porch', 'drone'),
      allowNull: true,
    },
    paymentOption: {
      type: Sequelize.ENUM('cash', 'card', 'swish'),
      allowNull: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('help_requests'),
};
