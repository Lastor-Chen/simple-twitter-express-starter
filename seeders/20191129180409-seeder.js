'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {

    return Promise.all([
      queryInterface.bulkInsert('Users',
        Array.from({ length: 20 }, (val, index) => ({
          name: 'root',
          email: index === 0 ? 'root@example.com' : `user${index}@example.com`,
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          avatar: faker.image.avatar(),
          introduction: faker.lorem.lines(3),
          role: index === 0 ? 'admin' : ''
        }))
      ),
      queryInterface.bulkInsert('Tweets',
        Array.from({ length: 20 }).map((item, index) => ({
          UserId: Math.floor(Math.random() * 3) + 1,
          description: faker.lorem.sentence(30)
        }))
      ),
      queryInterface.bulkInsert('Replies',
        Array.from({ length: 30 }).map((item, index) => ({
          UserId: Math.floor(Math.random() * 3) + 1,
          TweetId: Math.floor(Math.random() * 20) + 1,
          comment: faker.lorem.sentence(10),
        }))
      ),
      queryInterface.bulkInsert('Likes',
        Array.from({ length: 10 }).map((item, index) => ({
          UserId: Math.floor(Math.random() * 3) + 1,
          TweetId: ++index,
        }))
      ),
      queryInterface.bulkInsert('Followships',
        followship.map(item => ({
          followerId: item[0],
          followingId: item[1],
        }))
      )
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete('Users', null, {}),
      queryInterface.bulkDelete('Tweets', null, {}),
      queryInterface.bulkDelete('Replies', null, {}),
      queryInterface.bulkDelete('Likes', null, {}),
      queryInterface.bulkDelete('Followships', null, {})
    ])
  }
};
