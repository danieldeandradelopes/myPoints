import Sequelize, { Model } from 'sequelize';

class Unity extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        deleted_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Unity;
