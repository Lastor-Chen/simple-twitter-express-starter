'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Tweets', 'createdAt', {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }),
      queryInterface.changeColumn('Tweets', 'updatedAt', {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Tweets', 'createdAt', {
        allowNull: false,
        type: Sequelize.DATE,
      }),
      queryInterface.changeColumn('Tweets', 'updatedAt', {
        allowNull: false,
        type: Sequelize.DATE,
      })
    ])
  }
};
