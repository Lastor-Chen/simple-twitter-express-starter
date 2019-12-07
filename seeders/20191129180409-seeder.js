'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert('Users',
        Array.from({ length: 20 }, (val, index) => ({
          name: index === 0 ? 'root' : faker.name.findName(),
          email: index === 0 ? 'root@example.com' : `user${index}@example.com`,
          password: bcrypt.hashSync('12345678', 10),
          avatar: faker.image.avatar(),
          introduction: faker.lorem.lines(2),
          role: index === 0 ? 'admin' : ''
        }))
      ),
      queryInterface.bulkInsert('Tweets',
        Array.from({ length: 30 }, () => ({
          UserId: randomNum(1, 5),
          description: faker.lorem.lines(2),
        }))
      ),
      queryInterface.bulkInsert('Replies',
        Array.from({ length: 30 }, () => ({
          UserId: randomNum(1, 10),
          TweetId: randomNum(20, 30),
          comment: faker.lorem.lines(2),
        }))
      ),
      queryInterface.bulkInsert('Likes',
        Array.from({ length: 10 }, (val, index) => ({
          UserId: ++index,
          TweetId: randomNum(25, 30)
        }))
      ),
      queryInterface.bulkInsert('Followships',
        Array.from({ length: 10 }, (val, index) => ({
          followerId: ++index,   // 取 id 前10
          followingId: randomNum(11, 15)  // 取id 11-15，避開id 1-10，避免follow自己
        }))
      )
    ])
  },

  down: (queryInterface, Sequelize) => {
    const option = { truncate: true, restartIdentity: true }

    return Promise.all([
      queryInterface.bulkDelete('Users', null, option),
      queryInterface.bulkDelete('Tweets', null, option),
      queryInterface.bulkDelete('Replies', null, option),
      queryInterface.bulkDelete('Likes', null, option),
      queryInterface.bulkDelete('Followships', null, option)
    ])
  }
};
