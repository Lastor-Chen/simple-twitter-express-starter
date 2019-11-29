'use strict';
const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    const users = [
      { email: 'root@example.com', role: "Admin", name: "root" },
      { email: 'user1@example.com', role: "User", name: "user1" },
      { email: 'user2@example.com', role: "User", name: "user2" }
    ]

    return Promise.all([
      queryInterface.bulkInsert('Users',
        users.map((item, index) => ({
          name: item.name,
          email: item.email,
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          avatar: faker.image.imageUrl(),
          introduction: faker.lorem.sentence(10),
          role: item.role,
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      ),
      queryInterface.bulkInsert('Tweets',
        Array.from({ length: 20 }).map((item, index) => ({
          UserId: Math.floor(Math.random() * 3) + 1,
          description: faker.lorem.sentence(30),
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      ),
      queryInterface.bulkInsert('Replies',
        Array.from({ length: 30 }).map((item, index) => ({
          UserId: Math.floor(Math.random() * 3) + 1,
          TweetId: Math.floor(Math.random() * 20) + 1,
          comment: faker.lorem.sentence(10),
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      ),
      queryInterface.bulkInsert('Likes',
        Array.from({ length: 10 }).map((item, index) => ({
          UserId: Math.floor(Math.random() * 3) + 1,
          TweetId: ++index,
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      ),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete('Users', null, {}),
      queryInterface.bulkDelete('Tweets', null, {}),
      queryInterface.bulkDelete('Replies', null, {}),
      queryInterface.bulkDelete('Likes', null, {}),
    ])
  }
};
