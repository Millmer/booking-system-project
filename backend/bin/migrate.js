async function runScript () {
  try {
    const environment = process.env.NODE_ENV || 'local';
    const dbConfig = require('./../knexfile.js')[environment];
    const knex = require('knex')(dbConfig);
    console.log(`Knex imported: ${knex}`);
    console.log('Starting Knex migrate');
    await knex.migrate.latest().spread(
      function (batchNo, log) {
        console.log('Migrating...');
        if (log.length === 0) {
          console.log('Already up to date');
        }
        console.log(`Batch ${batchNo} run: ${log.length} migrations \n ${log.join('\n')}`);

        knex.destroy();
        process.exit(0);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
runScript();