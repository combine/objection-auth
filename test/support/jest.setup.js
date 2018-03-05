import { Model } from 'objection';
import db from '../db';

Model.knex(db);

// Global beforeAll()
beforeAll(function() {
  db.migrate.rollback().then(() => {
    db.migrate.latest().then(() => {
      console.log('DB migrated.');
    });
  });
});
