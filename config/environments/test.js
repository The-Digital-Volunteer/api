module.exports = {
  port: 8080,
  migrate: true,
  db: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true,
    },
    logging: false,
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  },
};
