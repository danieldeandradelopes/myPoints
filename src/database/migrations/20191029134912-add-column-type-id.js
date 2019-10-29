module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('products', 'unity_id', {
      type: Sequelize.INTEGER,
      references: { model: 'unity', key: 'id' },
      onUpdate: 'CASCADE',
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('products', 'unity_id');
  },
};
