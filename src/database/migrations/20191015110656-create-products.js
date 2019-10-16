module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('product', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      old_price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      new_price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      category_id: {
        type: Sequelize.INTEGER,
        references: { model: 'category', key: 'id' },
        onUpdate: 'CASCADE',
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('product');
  },
};
