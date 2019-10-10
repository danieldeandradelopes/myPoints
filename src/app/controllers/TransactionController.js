import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
// import pt from 'date-fns/locale/pt';
import Transaction from '../models/Transaction';
import User from '../models/User';
import File from '../models/File';
import Account from '../models/Account';

// import Notification from '../schemas/Notification';

// import Queue from '../../lib/Queue';
// import CancellationMail from '../jobs/CancellationMail';

class TransactionController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const transactions = await Transaction.findAll({
      where: { user_id: req.userId, deleted_at: null },
      order: ['date'],
      attributes: ['id', 'date', 'cash_value'],
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
    return res.json(transactions);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      user_id: Yup.number().required(),
      date: Yup.date().required(),
      cash_value: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'As validações falharam!' });
    }
    const { provider_id, user_id, date, cash_value } = req.body;

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res.status(401).json({
        error: 'Você não pode adicionar pontos sendo um cliente!',
      });
    }

    // data passada?
    // transformar data pegando apenas horas e não minutos
    const hourStart = startOfHour(parseISO(date));
    if (isBefore(hourStart, new Date())) {
      return res
        .status(400)
        .json({ error: 'Datas passadas não são permitidas' });
    }

    if (provider_id === user_id) {
      return res
        .status(400)
        .json({ error: 'Você não pode atribuir pontos a você mesmo!' });
    }

    const { id, balance } = await Account.findOne({
      where: { user_id },
    });

    await Account.update(
      {
        balance: cash_value + balance,
      },
      {
        where: {
          id,
        },
      }
    );

    const transaction = await Transaction.create({
      user_id,
      provider_id,
      date,
      cash_value,
      account_id: id,
    });

    return res.json(transaction);
  }

  async delete(req, res) {
    const transaction = await Transaction.findByPk(req.params.id);

    const { account_id, cash_value } = await Transaction.findByPk(
      req.params.id
    );

    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!isProvider) {
      return res.status(401).json({
        error: 'Somente funcionários podem excluir uma transação!',
      });
    }

    transaction.deleted_at = new Date();

    const { id, balance } = await Account.findByPk(account_id);

    await Account.update(
      {
        balance: balance - cash_value,
      },
      {
        where: {
          id,
        },
      }
    );

    await transaction.save();

    return res.json(transaction);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      cash_value: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const transaction = await Transaction.findOne({
      where: { id: req.params.id },
    });

    const account = await Account.findByPk(transaction.account_id);

    if (req.body.cash_value > transaction.cash_value) {
      const new_cash_value = req.body.cash_value - transaction.cash_value;

      await Account.update(
        {
          balance: account.balance + new_cash_value,
        },
        {
          where: {
            id: account.id,
          },
        }
      );
    } else if (req.body.cash_value < transaction.cash_value) {
      const new_cash_value = req.body.cash_value - transaction.cash_value;
      await Account.update(
        {
          balance: account.balance + new_cash_value,
        },
        {
          where: {
            id: account.id,
          },
        }
      );
    }

    await transaction.update(req.body);

    const { id, date, cash_value, user } = await Transaction.findByPk(
      req.params.id,
      {
        include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
      }
    );

    return res.json({
      id,
      date,
      cash_value,
      user,
    });
  }
}

export default new TransactionController();
