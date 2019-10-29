module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('products', 'type', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('products', 'type');
  },
};
