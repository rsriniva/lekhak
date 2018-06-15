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
        // there should an error
        //should.exist(err);
        // there should be a 404 status code
        res.status.should.equal(404);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.eql('error');
        // the JSON response body should have a
        // key-value pair of {"message": "That movie does not exist."}
        res.body.message.should.eql('That note does not exist.');
        done();
      });
    });
  });

});
