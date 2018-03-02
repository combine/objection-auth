
exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('name');
    table.string('email');
    table.string('password');
    table.string('resetPasswordToken');
    table.string('resetPasswordExp');
    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
