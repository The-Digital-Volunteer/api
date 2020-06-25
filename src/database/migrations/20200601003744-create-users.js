module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('users', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    bankId: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    },
    passwordHash: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    about: {
      type: Sequelize.STRING(2048),
      allowNull: true,
    },
    avatar: {
      type: Sequelize.STRING(1024),
      allowNull: true,
    },
    token: {
      type: Sequelize.STRING(1024),
      allowNull: true,
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      validate: {
        min: -1,
        max: 1,
      },
    },
    role: {
      type: Sequelize.ENUM('inneed', 'helper', 'admin'),
      defaultValue: 'helper',
    },
    locationLatitude: {
      type: Sequelize.FLOAT(9, 6),
      allowNull: true,
    },
    locationLongitude: {
      type: Sequelize.FLOAT(9, 6),
      allowNull: true,
    },
    addressStreet: {
      type: Sequelize.STRING(512),
      allowNull: true,
    },
    addressPostalCode: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    addressCity: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    skills: {
      // pipe-separeted list of skills: driver|picker|shopper|walker|artist|inmune
      type: Sequelize.STRING(1024),
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

  down: (queryInterface) => queryInterface.dropTable('users'),
};
