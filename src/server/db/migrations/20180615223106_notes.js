
exports.up = function(knex, Promise) {
  return knex.schema.createTable('notes',(table) => {
    table.increments('id').unsigned().primary();
    table.text('title').notNullable();
    table.text('content').notNullable();
    table.text('tags').notNullable();
    table.dateTime('post_date').notNullable().defaultTo(knex.fn.now());
  });  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('notes');
};
