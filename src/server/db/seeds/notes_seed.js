
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('notes').del()
    .then(function () {
      // Inserts seed entries
      const posts = [{
        title: 'First Post',
        content: 'This is a test first post',
        tags: 'first, test'
      }, {
        title: 'Second Post',
        content: 'This is a test second post',
        tags: 'second, test'
      }, {
        title: 'Third Post',
        content: 'This is a test third post',
        tags: 'third, test'
      }];

      return knex('notes').insert(posts);
    });
};
