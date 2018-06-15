const knex = require('../connection');

function getAllNotes() {
  return knex('notes').select('*');
}

function getSingleNote(id) {
  return knex('notes')
  .select('*')
  .where({ id: parseInt(id) });
}

module.exports = {
  getAllNotes,
  getSingleNote
};
