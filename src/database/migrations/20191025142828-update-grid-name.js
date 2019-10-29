module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('grids', 'name', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('grids', 'grids');
  },
};
