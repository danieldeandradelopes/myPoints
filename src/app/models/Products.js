import Sequelize, { Model } from 'sequelize';

class Products extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        description: Sequelize.STRING,
        stock: Sequelize.DOUBLE,
        type: Sequelize.STRING,
        price: Sequelize.DOUBLE,
        deleted_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Grid, { foreignKey: 'grid_id', as: 'grids' });
    this.belongsTo(models.PictureProducts, {
      foreignKey: 'picture_id',
      as: 'picture_products',
    });
  }
}

export default Products;
