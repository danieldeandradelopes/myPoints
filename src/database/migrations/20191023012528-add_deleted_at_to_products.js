module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('products', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('products', 'deleted_at');
  },
};
