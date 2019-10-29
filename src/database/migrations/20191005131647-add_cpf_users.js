module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'cpf', {
      type: Sequelize.STRING,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'cpf');
  },
};
