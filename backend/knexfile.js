module.exports = {
  local: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: __dirname + '/src/migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: __dirname + '/src/seeds'
    }
  },
  dev: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: __dirname + '/src/migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: __dirname + '/src/seeds'
    }
  },
  production: {
    client: 'pg',
    connection: {
      host:     process.env.PGHOST,
      port:     process.env.PGPORT,
      database: process.env.PGDATABASE,
      user:     process.env.PGUSER,
      password: process.env.PGPASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: __dirname + '/src/migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: __dirname + '/src/seeds'
    }
  },
};
