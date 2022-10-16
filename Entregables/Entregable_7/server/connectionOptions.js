const options = {
  mysql: {
    client: "mysql",
    connection: {
      host: process.env.mysql_host,
      user: process.env.mysql_user,
      password: process.env.mysql_pass,
      database: process.env.mysql_db,
    },
    pool: { min: 0, max: 10 },
  },
  sqlite3: {
    client: "sqlite3",
    connection: {
      filename: "./DB/ecommerce.sqlite",
    },
    useNullAsDefault: true,
  },
};

module.exports = { options };
