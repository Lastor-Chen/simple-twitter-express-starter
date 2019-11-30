'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Users', 'createdAt', {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')  //預設為當前時間戳
      }),
      queryInterface.changeColumn('Users', 'updatedAt', {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Users', 'createdAt', {
        allowNull: false,
        type: Sequelize.DATE,
      }),
      queryInterface.changeColumn('Users', 'updatedAt', {
        allowNull: false,
        type: Sequelize.DATE,
      })
    ])
  }
};
