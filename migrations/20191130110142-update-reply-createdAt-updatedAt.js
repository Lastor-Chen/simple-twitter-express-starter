'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Replies', 'createdAt', {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }),
      queryInterface.changeColumn('Replies', 'updatedAt', {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Replies', 'createdAt', {
        allowNull: false,
        type: Sequelize.DATE,
      }),
      queryInterface.changeColumn('Replies', 'updatedAt', {
        allowNull: false,
        type: Sequelize.DATE,
      })
    ])
  }
};
