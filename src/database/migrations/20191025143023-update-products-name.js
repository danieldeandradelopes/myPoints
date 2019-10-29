module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('products', 'name', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('products', 'grids');
  },
};
