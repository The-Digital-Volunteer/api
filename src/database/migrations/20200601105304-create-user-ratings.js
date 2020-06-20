
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('user_ratings', {
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
    toUser: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    value: {
      type: Sequelize.INTEGER,
      validate: {
        min: 0,
        max: 10,
      },
    },
    comment: {
      type: Sequelize.STRING(2048),
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

  down: (queryInterface) => queryInterface.dropTable('user_ratings'),
};
