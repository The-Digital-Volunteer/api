module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('messages', {
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
    helpRequest: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    title: {
      type: Sequelize.STRING(1024),
      allowNull: true,
    },
    content: {
      type: Sequelize.STRING(4096),
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

  down: (queryInterface) => queryInterface.dropTable('messages'),
};
