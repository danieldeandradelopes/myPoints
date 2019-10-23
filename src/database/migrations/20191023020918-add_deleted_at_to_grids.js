module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('grids', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('grids', 'deleted_at');
  },
};
