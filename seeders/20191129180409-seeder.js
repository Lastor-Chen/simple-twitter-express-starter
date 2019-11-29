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
      )
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete('Users', null, {})
    ])
  }
};
