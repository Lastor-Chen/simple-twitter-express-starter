'use strict';

const models = ['Users', 'Tweets', 'Replies', 'Likes', 'Followships']

module.exports = {
  up: (queryInterface, Sequelize) => {
    const config = {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }

    return Promise.all([
      ...models.map(model =>
        queryInterface.changeColumn(model, 'createdAt', config)
      ),
      ...models.map(model =>
        queryInterface.changeColumn(model, 'updatedAt', config)
      )
    ])
  },

  down: (queryInterface, Sequelize) => {
    const config = {
      allowNull: false,
      type: Sequelize.DATE,
    }

    return Promise.all([
      ...models.map(model =>
        queryInterface.changeColumn(model, 'createdAt', config)
      ),
      ...models.map(model =>
        queryInterface.changeColumn(model, 'updatedAt', config)
      )
    ])
  }
};
