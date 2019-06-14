'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'image', {
      type: Sequelize.STRING,
      defaultValue: 'https://via.placeholder.com/400'
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'image')
  }
};
