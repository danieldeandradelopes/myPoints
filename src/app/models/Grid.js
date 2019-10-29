import Sequelize, { Model } from 'sequelize';

class Grid extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        details: Sequelize.STRING,
        deleted_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Grid;
