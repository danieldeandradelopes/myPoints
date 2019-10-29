import * as Yup from 'yup';
import Unity from '../models/Unity';
import User from '../models/User';

class UnityController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const unity = await Unity.findAll({
      where: { deleted_at: null },
      attributes: ['id', 'name'],
      limit: 20,
      offset: (page - 1) * 20,
    });
    return res.json(unity);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }
    const { name } = req.body;

    const provider_id = req.userId;

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res.status(401).json({
        error: 'Access blocked!',
      });
    }

    const unityExits = await Unity.findOne({
      where: { name, deleted_at: null },
    });

    if (unityExits) {
      return res.status(400).json({ error: 'Unity already exists!' });
    }

    const unity = await Unity.create({
      name,
    });

    return res.json(unity);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!isProvider) {
      return res.status(401).json({
        error: 'Access blocked!',
      });
    }

    const unity = await Unity.findOne({
      where: { id: req.params.id },
    });

    if (!unity) {
      return res.status(400).json({ error: 'Id dont exists!' });
    }
    const unityNameExists = await Unity.findOne({
      where: { name: req.body.name, deleted_at: null },
    });

    if (unityNameExists) {
      return res.status(400).json({ error: 'Unity already exists!' });
    }

    await unity.update(req.body);

    return res.json(unity);
  }

  async delete(req, res) {
    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!isProvider) {
      return res.status(401).json({
        error: 'Access blocked!',
      });
    }

    const unity = await Unity.findByPk(req.params.id);

    unity.deleted_at = new Date();

    await unity.save();

    return res.json(unity);
  }
}

export default new UnityController();
