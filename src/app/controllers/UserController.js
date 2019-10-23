import * as Yup from 'yup';
import validarCpf from 'validar-cpf';
import User from '../models/User';
import File from '../models/File';
import Account from '../models/Account';

import Queue from '../../lib/Queue';
import RegisterMail from '../jobs/RegisterMail';

class UserController {
  async index(req, res) {
    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!isProvider) {
      return res.status(401).json({
        error: 'Access blocked!',
      });
    }

    const users = await User.findAll({
      where: { provider: false },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(users);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      cpf: Yup.string()
        .required()
        .min(11),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const cpfIsValid = validarCpf(req.body.cpf);

    if (!cpfIsValid) {
      return res.status(400).json({ error: 'This CPF is invalid!' });
    }

    const userExists = await User.findOne({
      where: { email: req.body.email, cpf: req.body.cpf },
    });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const newPassword = req.body.cpf.substring(0, 6);

    const { id, name, email, provider } = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: newPassword,
      cpf: req.body.cpf,
      provider: req.body.provider,
    });

    await Account.create({
      balance: 0,
      user_id: id,
    });

    // send notification
    const user = await User.findByPk(id);

    await Queue.add(RegisterMail.key, {
      user,
    });

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({
        where: { email },
      });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(400).json({ error: 'Password does not match.' });
    }

    await user.update(req.body);

    const { id, name, avatar } = await User.findByPk(req.userId, {
      include: [
        { model: File, as: 'avatar', attributes: ['id', 'path', 'url'] },
      ],
    });

    return res.json({
      id,
      name,
      email,
      avatar,
    });
  }
}

export default new UserController();
