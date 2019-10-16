import * as Yup from 'yup';
import User from '../models/User';
import Category from '../models/Category';

class CategoryController {
  async index(req, res) {
    const categorys = await Category.findAll({
      order: [['name', 'ASC']],
      attributes: ['name', 'description'],
    });

    return res.json(categorys);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      description: Yup.string().required(),
    });

    const { name, description } = req.body;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const provider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!provider) {
      return res.status(400).json({ error: 'Access blocked!' });
    }

    const category = await Category.create({
      id: 1,
      name,
      description,
    });

    return res.json(category);
  }

  // async update(req, res) {
  //   const schema = Yup.object().shape({
  //     name: Yup.string(),
  //     email: Yup.string().email(),
  //     oldPassword: Yup.string().min(6),
  //     password: Yup.string()
  //       .min(6)
  //       .when('oldPassword', (oldPassword, field) =>
  //         oldPassword ? field.required() : field
  //       ),
  //     confirmPassword: Yup.string().when('password', (password, field) =>
  //       password ? field.required().oneOf([Yup.ref('password')]) : field
  //     ),
  //   });

  //   if (!(await schema.isValid(req.body))) {
  //     return res.status(400).json({ error: 'Validation fails!' });
  //   }

  //   const { email, oldPassword } = req.body;

  //   const user = await User.findByPk(req.userId);

  //   if (email !== user.email) {
  //     const userExists = await User.findOne({
  //       where: { email },
  //     });

  //     if (userExists) {
  //       return res.status(400).json({ error: 'User already exists.' });
  //     }
  //   }

  //   if (oldPassword && !(await user.checkPassword(oldPassword))) {
  //     return res.status(400).json({ error: 'Password does not match.' });
  //   }

  //   await user.update(req.body);

  //   const { id, name, avatar } = await User.findByPk(req.userId, {
  //     include: [
  //       { model: File, as: 'avatar', attributes: ['id', 'path', 'url'] },
  //     ],
  //   });

  //   return res.json({
  //     id,
  //     name,
  //     email,
  //     avatar,
  //   });
  // }
}

export default new CategoryController();
