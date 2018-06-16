process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../src/server/index');
const knex = require('../src/server/db/connection');

describe('routes : notes', () => {

  beforeEach(() => {
    return knex.migrate.rollback()
    .then(() => { return knex.migrate.latest(); })
    .then(() => { return knex.seed.run(); });
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  describe('GET /api/v1/notes', () => {
    it('should return all notes', (done) => {
      chai.request(server)
      .get('/api/v1/notes')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.status.should.equal('success');
        res.body.data.length.should.eql(3);
        res.body.data[0].should.include.keys(
          'id', 'title', 'content', 'tags', 'post_date'
        );
        done();
      });
    });
  });

  describe('GET /api/v1/notes/:id', () => {

    it('should respond with a single note', (done) => {
      chai.request(server)
      .get('/api/v1/notes/1')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data.length.should.eql(1);
        res.body.data[0].should.include.keys(
          'id', 'title', 'content', 'tags', 'post_date'
        );
        res.body.data[0].title.should.equal('First Post');
        done();
    });
  });

    it('should throw an error if the note does not exist', (done) => {
      chai.request(server)
      .get('/api/v1/notes/9999999')
      .end((err, res) => {
        res.status.should.equal(404);
        res.type.should.equal('application/json');
        res.body.status.should.eql('error');
        res.body.message.should.eql('That note does not exist.');
        done();
      });
    });
  });

  describe('POST /api/v1/notes', () => {
    it('should add the note', (done) => {
      chai.request(server)
      .post('/api/v1/notes')
      .send({
        title: 'Fourth Post',
        content: 'This is the fourth post',
        tags: 'fourth, test'
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(201);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data[0].should.equal(4); // ID of inserted post
        done();
      });
    });

    it('should throw an error if the payload is malformed', (done) => {
      chai.request(server)
      .post('/api/v1/notes')
      .send({
        title: 'Fifth Post'
      })
      .end((err, res) => {
        res.status.should.equal(400);
        res.type.should.equal('application/json');
        res.body.status.should.eql('error');
        should.exist(res.body.message);
        done();
      });
    });
  });

  describe('PUT /api/v1/notes', () => {
    it('should update the note', (done) => {
      knex('notes')
      .select('*')
      .then((notes) => {
        const noteObject = notes[0];
        chai.request(server)
        .put('/api/v1/notes/' + + noteObject.id)
        .send({
          content: 'First Post updated'
        })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        knex('notes').select('*')
        .then((updatedNotes) => {
          const updatedNote = updatedNotes[0];
          updatedNote.content.should.eql('First Post updated');
          done();
        });
      });
    });
  });

    it('should throw an error if the note does not exist', (done) => {
        chai.request(server)
        .put('/api/v1/notes/9999999')
        .send({
          content: 'Error'
        })
        .end((err, res) => {
          res.status.should.equal(404);
          res.type.should.equal('application/json');
          res.body.status.should.eql('error');
          res.body.message.should.eql('That note does not exist.');
          done();
        });
    });
  });

  // DELETE a note
  describe('DELETE /api/v1/notes/:id', () => {
  it('should delete the note', (done) => {
    knex('notes')
    .select('*')
    .then((notes) => {
      const noteObject = notes[0];
      const lengthBeforeDelete = notes.length;
      chai.request(server)
      .delete('/api/v1/notes/' + noteObject.id)
      .end((err, res) => {
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        knex('notes').select('*')
        .then((updatedNotes) => {
          updatedNotes.length.should.eql(lengthBeforeDelete - 1);
          done();
        });
      });
    });
  });

  it('should throw an error if the note does not exist', (done) => {
    chai.request(server)
    .delete('/api/v1/notes/9999999')
    .end((err, res) => {
      res.status.should.equal(404);
      res.type.should.equal('application/json');
      res.body.status.should.eql('error');
      res.body.message.should.eql('That note does not exist.');
      done();
    });
  });
  });

});
