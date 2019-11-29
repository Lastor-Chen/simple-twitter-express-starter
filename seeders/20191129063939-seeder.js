'use strict';

const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
   return Promise.all([
     queryInterface.bulkInsert('Users',
       Array.from({ length: 10 }, (v, i) => ({
        name: faker.name.findName(),
        email: `user${i}@example.com`,
        password: '123456',
        avatar: faker.image.avatar(),
        introduction: faker.lorem.sentences(3),
        role: '',
        createdAt: new Date(),
        updatedAt: new Date()
       })),
      queryInterface.bulkInsert('Tweets',
        Array.from({ length: 10 }, () => ({
          UserId: Math.floor(Math.random() * 5) + 1,
          description: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      ),
      queryInterface.bulkInsert('Replies',
        Array.from({ length: 10 }, () => ({
          UserId: Math.floor(Math.random() * 5) + 1,
          TweetId: Math.floor(Math.random() * (10 - 5 + 1)) + 5,
          comment: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      ),
      queryInterface.bulkInsert('Likes',
        Array.from({ length: 10 }, (v, i) => ({
          UserId: ++i,
          TweetId: Math.floor(Math.random() * (10 - 5 + 1)) + 5,
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      )
     )
   ])
  },

  down: (queryInterface, Sequelize) => {
    const option = { truncate: true, restartIdentity: true }
    return Promise.all([
      queryInterface.bulkDelete('Users', null, option),
      queryInterface.bulkDelete('Tweets', null, option),
      queryInterface.bulkDelete('Replies', null, option),
      queryInterface.bulkDelete('Likes', null, option)
    ])
  }
};
