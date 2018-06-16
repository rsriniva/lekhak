const knex = require('../connection');

// get all notes
function getAllNotes() {
  return knex('notes').select('*');
}

// get a single note
function getSingleNote(id) {
  return knex('notes')
  .select('*')
  .where({ id: parseInt(id) });
}

// add a note
function addNote(note) {
  return knex('notes')
  .insert(note);
}

// update a note
function updateNote(id, note) {
  return knex('notes')
  .update(note)
  .where({ id: parseInt(id) });
}

// delete a note
function deleteNote(id) {
  return knex('notes')
  .del()
  .where({ id: parseInt(id) });
}

module.exports = {
  getAllNotes,
  getSingleNote,
  addNote,
  updateNote,
  deleteNote
};
