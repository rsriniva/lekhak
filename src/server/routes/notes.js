const Router = require('koa-router');
const queries = require('../db/queries/notes');

const router = new Router();
const BASE_URL = `/api/v1/notes`;

// GET all notes
router.get(BASE_URL, async (ctx) => {
  try {
    const notes = await queries.getAllNotes();
    ctx.body = {
      status: 'success',
      data: notes
    };
  } catch (err) {
    console.log(err)
  }
})

// GET a single note
router.get(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const note = await queries.getSingleNote(ctx.params.id);
    if (note.length) {
      ctx.body = {
        status: 'success',
        data: note
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That note does not exist.'
      };
    }
  } catch (err) {
    console.log(err)
  }
})

// POST a note
router.post(`${BASE_URL}`, async (ctx) => {
  try {
    const noteId = await queries.addNote(ctx.request.body);
    if (!isNaN(noteId)) {
      ctx.status = 201;
      ctx.body = {
        status: 'success',
        data: noteId
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: 'Something went wrong.'
      };
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: 'Sorry, an error has occurred.'
    };
  }
})

// PUT a note record
router.put(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const noteId = await queries.updateNote(ctx.params.id, ctx.request.body);
    if (noteId > 0) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: noteId
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That note does not exist.'
      };
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: 'Sorry, an error has occurred.'
    };
  }
})

// DELETE a note record
router.delete(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const noteId = await queries.deleteNote(ctx.params.id);
    if (noteId > 0) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: noteId
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That note does not exist.'
      };
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: 'Sorry, an error has occurred.'
    };
  }
})

module.exports = router;
