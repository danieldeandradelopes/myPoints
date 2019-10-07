// import * as Yup from 'yup';
// import { startOfHour, parseISO, isBefore } from 'date-fns';
// import pt from 'date-fns/locale/pt';
import Account from '../models/Account';
import User from '../models/User';
import File from '../models/File';
// import Notification from '../schemas/Notification';

// import Queue from '../../lib/Queue';
// import CancellationMail from '../jobs/CancellationMail';

class AccountController {
  async index(req, res) {
    const { page = 1 } = req.query;

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
    return res.json(accounts);
  }

  // async store(req, res) {
  //   const schema = Yup.object().shape({
  //     provider_id: Yup.number().required(),
  //     user_id: Yup.number().required(),
  //     date: Yup.date().required(),
  //     cash_value: Yup.number().required(),
  //   });

  //   if (!(await schema.isValid(req.body))) {
  //     return res.status(400).json({ error: 'As validações falharam!' });
  //   }
  //   const { provider_id, user_id, date, cash_value } = req.body;

  //   const isProvider = await User.findOne({
  //     where: { id: provider_id, provider: true },
  //   });

  //   if (!isProvider) {
  //     return res.status(401).json({
  //       error: 'Você não pode adicionar pontos sendo um cliente!',
  //     });
  //   }

  //   // data passada?
  //   // transformar data pegando apenas horas e não minutos
  //   const hourStart = startOfHour(parseISO(date));
  //   if (isBefore(hourStart, new Date())) {
  //     return res
  //       .status(400)
  //       .json({ error: 'Datas passadas não são permitidas' });
  //   }

  //   if (provider_id === user_id) {
  //     return res
  //       .status(400)
  //       .json({ error: 'Você não pode atribuir pontos a você mesmo!' });
  //   }

  //   const transaction = await Transaction.create({
  //     user_id,
  //     provider_id,
  //     date,
  //     cash_value,
  //   });

  //   return res.json(transaction);
  // }

  // async delete(req, res) {
  //   const appointment = await Appointment.findByPk(req.params.id, {
  //     include: [
  //       {
  //         model: User,
  //         as: 'provider',
  //         attributes: ['name', 'email'],
  //       },
  //       {
  //         model: User,
  //         as: 'user',
  //         attributes: ['name'],
  //       },
  //     ],
  //   });

  //   if (appointment.user_id !== req.userId) {
  //     return res.status(401).json({
  //       error: 'Você não tem permissão para cancelar esse agendamento',
  //     });
  //   }

  //   const dateWithSub = subHours(appointment.date, 2);

  //   if (isBefore(dateWithSub, new Date())) {
  //     return res.status(401).json({
  //       error:
  //         'Você só pode cancelar o agendamento, com antecedência de 2 horas',
  //     });
  //   }

  //   appointment.canceled_at = new Date();

  //   await appointment.save();

  //   await Queue.add(CancellationMail.key, {
  //     appointment,
  //   });

  //   return res.json(appointment);
  // }
}

export default new AccountController();
