import Account from '../models/Account';
import User from '../models/User';
import File from '../models/File';

class AccountController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!isProvider) {
      return res.status(401).json({
        error: 'Access blocked!',
      });
    }

    const accounts = await Account.findAll({
      order: ['created_at'],
      attributes: ['id', 'created_at', 'balance'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    if (!accounts) {
      return res.status(400).json({ error: 'Unable to display account!' });
    }
    return res.json(accounts);
  }
}

export default new AccountController();
