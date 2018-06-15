const Router = require('koa-router');
const queries = require('../db/queries/notes');

const router = new Router();
const BASE_URL = `/api/v1/notes`;

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

module.exports = router;
