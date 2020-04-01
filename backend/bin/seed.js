async function runScript () {
  try {
    const environment = process.env.NODE_ENV || 'local';
    const dbConfig = require('./../knexfile.js')[environment];
    const knex = require('knex')(dbConfig);
    console.log(`Knex imported: ${knex}`);
    console.log('Starting Knex seed');
    const [ log ] = await knex.seed.run();
    console.log(log);
    if (log.length === 0) {
      console.log('Already up to date');
    }
    console.log(`Ran ${log.length} seed files`);
    knex.destroy();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
runScript();